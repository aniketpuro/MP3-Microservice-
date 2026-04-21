# 1. VPC Create karo (EKS ke liye dedicated VPC best hai)
module "vpc" {
  source = "terraform-aws-modules/vpc/aws"
  name   = "aniket-eks-vpc"
  cidr   = "10.0.0.0/16"

  azs             = ["us-east-1a", "us-east-1b"]
  public_subnets  = ["10.0.1.0/24", "10.0.2.0/24"]
  enable_nat_gateway = true # EKS nodes ko internet chahiye hota hai
}

# 2. EKS Cluster aur Worker Nodes
module "eks" {
  source  = "terraform-aws-modules/eks/aws"
  version = "~> 20.0"

  cluster_name    = "aniket-devops-cluster"
  cluster_version = "1.30"

  vpc_id                   = module.vpc.vpc_id
  subnet_ids               = module.vpc.public_subnets
  cluster_endpoint_public_access = true

  eks_managed_node_groups = {
    workers = {
      min_size     = 1
      max_size     = 4
      desired_size = var.worker_count

      instance_types = ["t3.medium"] # K8s ke liye t3.medium minimum recommendation hai
    }
  }
}

# 3. ArgoCD Installation (Automatic!)
resource "helm_release" "argocd" {
  name             = "argocd"
  repository       = "https://argoproj.github.io/argo-helm"
  chart            = "argo-cd"
  namespace        = "argocd"
  create_namespace = true
}