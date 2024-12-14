/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation. This is especially useful
 * for Docker builds.
 */
import { NextConfig } from "next";
import "./src/env.js";

/** @type {import("next").NextConfig} */
const config: NextConfig = {
  output: "standalone",
};

export default config;