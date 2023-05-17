#!/bin/bash

# JSONファイルを扱うために jq をインストール
apt update -y && apt install jq -y

cd /app/keys

# KMSキーのエイリアス名
AliasName='alias/alias_name'

# 暗号鍵をバイナリファイルに変換
openssl enc -d -base64 -A -in PlaintextKeyMaterial.b64 -out PlaintextKeyMaterial.bin

# KMSキーを生成しKeyId取得
awslocal kms create-key --origin EXTERNAL | tee create-key-output.json
KeyId=`jq -r '.KeyMetadata.KeyId' create-key-output.json`

# PublicKeyとImportTokenを取得
awslocal kms get-parameters-for-import \
  --key-id ${KeyId} \
  --wrapping-algorithm RSAES_OAEP_SHA_1 \
  --wrapping-key-spec RSA_2048 \
  | tee get-parameters-for-import-output.json

jq -r '.PublicKey' get-parameters-for-import-output.json > PublicKey.b64
openssl enc -d -base64 -A -in PublicKey.b64 -out PublicKey.bin

jq -r '.ImportToken' get-parameters-for-import-output.json > ImportToken.b64
openssl enc -d -base64 -A -in ImportToken.b64 -out ImportToken.bin

# 暗号鍵をインポート用に暗号化
openssl rsautl -encrypt \
  -in PlaintextKeyMaterial.bin \
  -oaep \
  -inkey PublicKey.bin \
  -keyform DER \
  -pubin \
  -out EncryptedKeyMaterial.bin

# 暗号化した鍵マテリアルをインポート
awslocal kms import-key-material \
  --key-id ${KeyId} \
  --encrypted-key-material fileb://EncryptedKeyMaterial.bin \
  --import-token fileb://ImportToken.bin \
  --expiration-model KEY_MATERIAL_DOES_NOT_EXPIRE

# KMSキーのエイリアス
awslocal kms create-alias --target-key-id ${KeyId} --alias-name ${AliasName}

# KMSキーの情報を確認
awslocal kms describe-key --key-id ${AliasName}
