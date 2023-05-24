#!/bin/bash

BUCKET_NAME=test-bucket

# create bucket
awslocal s3 mb s3://${BUCKET_NAME}

# show bucket list
awslocal s3 ls

# upload file
awslocal s3 cp /app/data/test.txt s3://${BUCKET_NAME}/test.txt

# show file list
awslocal s3 ls s3://${BUCKET_NAME}
