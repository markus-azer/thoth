locals {
  size_labels = {
    "size/xs" = { color = "0e8a16", description = "< 10 LOC" }
    "size/s"  = { color = "5cb85c", description = "< 100 LOC" }
    "size/m"  = { color = "fbca04", description = "< 400 LOC" }
    "size/l"  = { color = "f7a116", description = "< 800 LOC" }
    "size/xl" = { color = "d93f0b", description = "> 800 LOC" }
  }
}
