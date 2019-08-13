{ pkgs ? import <nixpkgs> {} }:

with pkgs;

stdenv.mkDerivation {
  name = "grafana-pcp";

  buildInputs = [
    nodejs-10_x
  ];
}
