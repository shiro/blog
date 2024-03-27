import {style} from "@client/style/commonStyle";


export const flashAnimation = style`
  animation: flash 0.6s alternate ease-in-out infinite;

  @keyframes flash {
    0% { opacity: 0.4; }
    100% { opacity: 0.7; }
  }
`;
