variable "aws-region" {
  type = string
  description = "AWS region"
}

variable "aws-access-key" {
  type = string
  description = "IAM access key"
}

variable "aws-secret-key" {
  type = string
  description = "IAM secret key"
}

variable "database-url" {
  type = string
  description = "Database Url"
}

variable "jwt-secret" {
  type = string
  description = "JWT Secret"
}

variable "facebook-app-id" {
  type = string
  description = "Facebook app id"
}

variable "facebook-app-secret" {
  type = string
  description = "Facebook app secret"
}

variable "facebook-callback-url" {
  type = string
  description = "Facebook callback url"
}

variable "mapbox-api-key" {
  type = string
  description = "Mapbox API key"
}

variable "rabbitmq-url" {
  type = string
  description = "RabbitMQ url"
}