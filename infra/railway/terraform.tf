terraform {
  required_version = ">= 1.6"

  required_providers {
    railway = {
      source  = "terraform-community-providers/railway"
      version = "0.6.2"
    }
    random = {
      source  = "hashicorp/random"
      version = "3.6.3"
    }
  }
}

provider "railway" {}
