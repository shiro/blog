import cssnano from "cssnano";
import tailwindcss from "@tailwindcss/postcss";
import postcssPresentEnv from "postcss-preset-env";
import pxtorem from "postcss-pxtorem";

export default {
  plugins: [
    pxtorem({
      replace: true,
      propList: ["*"],
    }),
    // postcssPresentEnv(),
    tailwindcss,
    ...(process.env.NODE_ENV === "production" ? [cssnano] : []),
  ],
};
