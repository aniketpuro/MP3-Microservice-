data "aws_vpc" "default_vpc" {
  default = true
}

data "aws_ec2_instance_type_offerings" "available" {
  filter {
    name   = "instance-type"
    values = [var.instance_type]
  }

  location_type = "availability-zone"
}

data "aws_subnets" "default_subnets" {
  filter {
    name   = "vpc-id"
    values = [data.aws_vpc.default_vpc.id]
  }

  filter {
    name   = "availability-zone"
    values = [for s in data.aws_ec2_instance_type_offerings.available.locations : s if s != "us-east-1e"]
  }
}