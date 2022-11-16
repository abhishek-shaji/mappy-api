resource "aws_s3_bucket" "mappy-uploads-prod" {
  bucket = "mappy-uploads-prod"
  acl    = "public-read"
  force_destroy = true

  tags = {
    Name        = "Mappy Uploads"
    Environment = "Prod"
  }
}