import React from "react";

interface Props {
  name: string;
  size?: string;
}

class Svg extends React.PureComponent<Props, any> {
  public render() {
    let { name, size } = this.props;
    size = size ? size : "16";
    switch (name) {
      case "metamask":
        return (
          <svg id="Layer_1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 404 420.2" width={size} height={size}>
            <path className="st0" d="M382.9 290.9l-24.4 82.5-47.9-13.1z" />
            <path className="st0" d="M310.6 360.3l46.2-63.3 26.1-6.1z" />
            <path className="st1" d="M347 228.7l35.9 62.2-26.1 6.1zM347 228.7l23.1-16 12.8 78.2z" />
            <path className="st2" d="M317.6 181.7l66.4-27.2-3.3 14.9zM378.6 187.3l-61-5.6 63.1-12.3z" />
            <path
              className="st2"
              d="M378.6 187.3l-8.5 25.4-52.5-31zM391.9 160.8l-11.2 8.6 3.3-14.9zM378.6 187.3l2.1-17.9 8.9 7.4z"
            />
            <path className="st3" d="M259.1 340.2l16.6 5.3 34.9 14.8z" />
            <path className="st2" d="M370.1 212.7l8.5-25.4 7.3 5.6zM370.1 212.7L301.2 190l16.4-8.3z" />
            <path className="st2" d="M334 103.8l-16.4 77.9-16.4 8.3z" />
            <path className="st2" d="M384 154.5l-66.4 27.2 16.4-77.9z" />
            <path className="st2" d="M334 103.8l69.3-8-19.3 58.7z" />
            <path className="st1" d="M370.1 212.7l-23.1 16-45.8-38.7z" />
            <path className="st2" d="M400.3 39.7l3 56.1-69.3 8z" />
            <path className="st3" d="M400.3 39.7L261.8 140.4 260 72.1z" />
            <path className="st1" d="M157 63.9l103 8.2 1.8 68.3z" />
            <path className="st2" d="M301.2 190l-39.4-49.6 72.2-36.6z" />
            <path className="st0" d="M301.2 190l45.8 38.7-64.3 7.1z" />
            <path className="st0" d="M282.7 235.8l-20.9-95.4 39.4 49.6z" />
            <path className="st2" d="M334 103.8l-72.2 36.6L400.3 39.7z" />
            <path className="st4" d="M157.9 358.7l32.7 34.1-44.5-40.5z" />
            <path className="st5" d="M310.6 360.3l15.5-58.9 30.7-4.4z" />
            <path className="st3" d="M25.3 194.6l56.6-59.5-49.3 52.4z" />
            <path className="st1" d="M356.8 297l-30.7 4.4 20.9-72.7zM261.8 140.4l-55.1-1.8L157 63.9z" />
            <path className="st6" d="M347 228.7l-20.9 72.7-1.7-35.5z" />
            <path className="st5" d="M282.7 235.8l64.3-7.1-22.6 37.2z" />
            <path className="st1" d="M206.7 138.6l55.1 1.8 20.9 95.4z" />
            <path className="st0" d="M206.7 138.6L58 1l99 62.9zM156.9 379.6l-129.2 40-25.8-98.5z" />
            <path className="st2" d="M44.5 219.2l48.8-38.3 40.9 9.5z" />
            <path className="st2" d="M134.2 190.4l-40.9-9.5 21.9-90.4z" />
            <path className="st2" d="M32.6 187.5l60.7-6.6-48.8 38.3z" />
            <path className="st5" d="M324.4 265.9l-25.2-12.7-16.5-17.4z" />
            <path className="st2" d="M32.6 187.5l-4.3-22.7 65 16.1z" />
            <path className="st7" d="M294 281.8l5.2-28.6 25.2 12.7z" />
            <path className="st1" d="M326.1 301.4L294 281.8l30.4-15.9z" />
            <path
              className="st2"
              d="M93.3 180.9l-65-16.1-5.3-19.1zM115.2 90.5l-21.9 90.4L23 145.7zM115.2 90.5l91.5 48.1-72.5 51.8z"
            />
            <path className="st0" d="M134.2 190.4l72.5-51.8 32.3 98.7zM239 237.3l-100.2-2.1-4.6-44.8z" />
            <path className="st1" d="M44.5 219.2l89.7-28.8 4.6 44.8zM282.7 235.8l-43.7 1.5-32.3-98.7z" />
            <path className="st5" d="M299.2 253.2l-5.2 28.6-11.3-46z" />
            <path className="st2" d="M58 1l148.7 137.6-91.5-48.1z" />
            <path className="st0" d="M1.9 321.1l125.4-5.2 29.6 63.7z" />
            <path className="st5" d="M156.9 379.6l-29.6-63.7 61.6-3z" />
            <path
              className="st1"
              d="M294 281.8l32.1 19.6 17.7 41.7zM138.8 235.2L1.9 321.1l42.6-101.9zM127.3 315.9L1.9 321.1l136.9-85.9zM282.7 235.8l8.2 29.8-39.6 2.3zM251.3 267.9L239 237.3l43.7-1.5z"
            />
            <path className="st4" d="M190.6 392.8l-33.7-13.2 117.2 19.7z" />
            <path className="st2" d="M44.5 219.2l-19.2-24.6 7.3-7.1z" />
            <path className="st8" d="M287.4 384.7l-13.3 14.6-117.2-19.7z" />
            <path className="st0" d="M293.7 348.9l-136.8 30.7 32-66.7z" />
            <path className="st8" d="M156.9 379.6l136.8-30.7-6.3 35.8z" />
            <path className="st2" d="M23 145.7l-4.5-76.9 96.7 21.7zM32.6 187.5L19.3 174l9-9.2z" />
            <path className="st5" d="M216.6 257.1l22.4-19.8-3.2 48.4z" />
            <path className="st5" d="M239 237.3l-22.4 19.8L184 274z" />
            <path className="st1" d="M343.8 343.1l-6.1-4.5-43.7-56.8z" />
            <path className="st5" d="M184 274l-45.2-38.8 100.2 2.1z" />
            <path className="st6" d="M235.8 285.7l3.2-48.4 12.3 30.6z" />
            <path className="st2" d="M14.9 153.3l8.1-7.6 5.3 19.1z" />
            <path className="st7" d="M235.8 285.7L184 274l32.6-16.9z" />
            <path className="st2" d="M115.2 90.5L18.5 68.8 58 1z" />
            <path className="st4" d="M274.1 399.3l5.5 15-89-21.5z" />
            <path className="st1" d="M188.9 312.9L184 274l51.8 11.7z" />
            <path className="st6" d="M138.8 235.2L184 274l4.9 38.9z" />
            <path className="st1" d="M251.3 267.9l39.6-2.3 46.8 73zM138.8 235.2l50.1 77.7-61.6 3z" />
            <path className="st6" d="M251.3 267.9l49.2 74.9-64.7-57.1z" />
            <path className="st1" d="M235.8 285.7l64.7 57.1-6.8 6.1z" />
            <path className="st1" d="M293.7 348.9l-104.8-36 46.9-27.2zM337.7 338.6l-37.2 4.2-49.2-74.9z" />
            <path className="st4" d="M347.5 373.8l-16 32.1-51.9 8.4zM279.6 414.3l-5.5-15 13.3-14.6z" />
            <path className="st4" d="M287.4 384.7l9.8-3.9-17.6 33.5zM279.6 414.3l17.6-33.5 50.3-7z" />
            <path className="st9" d="M337.7 338.6l12.3 7.5-37.4 4.5z" />
            <path className="st9" d="M312.6 350.6l-12.1-7.8 37.2-4.2zM308.3 356.5l45.5-5.5-6.3 22.8z" />
            <path
              className="st9"
              d="M347.5 373.8l-50.3 7 11.1-24.3zM297.2 380.8l-9.8 3.9 6.3-35.8zM293.7 348.9l6.8-6.1 12.1 7.8zM350 346.1l3.8 4.9-45.5 5.5z"
            />
            <path className="st9" d="M308.3 356.5l4.3-5.9 37.4-4.5zM293.7 348.9l14.6 7.6-11.1 24.3z" />
            <path className="st9" d="M312.6 350.6l-4.3 5.9-14.6-7.6z" />
          </svg>
        );
      case "create":
        return (
          <svg
            className="HydroSDK-themeSvg"
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 16 16">
            <path
              fill="#666"
              fillRule="evenodd"
              d="M13.156 5.496c-.018-.006-.023-.028-.018-.017C10.885.1 3.175 1.221 2.452 7.037c0 0-1.147.267-1.876 1.345a3.384 3.384 0 0 0-.548 2.332c.104.84.53 1.559 1.132 2.068 2.075 1.752 2.555-.589 1.525-.963-2.33-.85-.48-4.472 1.504-2.839-1.573-5.37 6.608-7.779 7.73-2.014 2.275-.085 3.61 3.127 1.267 4.593-.842.527-.223 2.434 1.438.954 2.397-2.136 1.506-6.081-1.468-7.017m-2.14 4.914a.851.851 0 0 1 0 1.172l-2.83 2.933a1.56 1.56 0 0 1-2.261 0l-.942-.976c-.75-.775.383-1.948 1.13-1.172 1.152 1.192 1.066.849 3.773-1.957a.78.78 0 0 1 1.13 0"
            />
          </svg>
        );
      case "import":
        return (
          <svg
            className="HydroSDK-themeSvg"
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 16 16">
            <path
              fill="#666"
              fillRule="evenodd"
              d="M13.165 5.477c-.018-.006-.023-.028-.018-.017C10.9.11 3.209 1.225 2.487 7.01c0 0-1.144.265-1.872 1.337-2.306 3.394 2.618 6.457 2.618 4.309 0-.42-.063-.727-.514-.89-2.4-.872-.391-4.377 1.5-2.824-.788-2.684 1.18-5.31 3.802-5.31 1.957 0 3.554 1.48 3.91 3.307 2.266-.085 3.605 3.109 1.265 4.568-.878.548-.103 1.927.759 1.433 3.12-1.787 2.521-6.424-.79-7.463m-1.952 7.309v-.028l-.002.013.002.015m-.002-.015c-.008.448-.36.755-.795.755H8.819v1.65a.811.811 0 0 1-.798.824.812.812 0 0 1-.798-.825v-1.649H5.627c-.44 0-.798-.285-.798-.74v-.028c0-.456.357-.88.798-.88h1.596v-1.65c0-.456.357-.824.798-.824a.81.81 0 0 1 .798.824v1.65h1.597c.436 0 .787.443.795.893"
            />
          </svg>
        );
      case "delete":
        return (
          <svg
            className="HydroSDK-themeSvg"
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 16 16">
            <path
              fill="#666"
              fillRule="evenodd"
              d="M13.165 5.477c-.018-.006-.023-.028-.018-.017C10.9.11 3.209 1.225 2.487 7.01c0 0-1.144.265-1.872 1.337-2.306 3.394 2.618 6.457 2.618 4.309 0-.42-.063-.727-.514-.89-2.4-.872-.391-4.377 1.5-2.824-.788-2.684 1.18-5.31 3.802-5.31 1.957 0 3.554 1.48 3.91 3.307 2.266-.085 3.605 3.109 1.265 4.568-.878.548-.103 1.927.759 1.433 3.12-1.787 2.521-6.424-.79-7.463m-1.952 7.309v-.028l-.002.013.002.015m-.986 2.221c-.322.311-.788.28-1.096-.028l-1.13-1.129-1.165 1.166a.811.811 0 0 1-1.147.019.812.812 0 0 1 .018-1.147l1.166-1.167-1.128-1.128c-.312-.312-.363-.766-.041-1.088l.02-.02c.322-.322.875-.37 1.187-.058l1.128 1.128 1.166-1.166a.811.811 0 0 1 1.148-.018.81.81 0 0 1-.019 1.147l-1.166 1.166 1.13 1.13c.307.307.242.87-.07 1.193"
            />
          </svg>
        );
      case "logo":
        return (
          <svg
            className="HydroSDK-themeSvg"
            width={size}
            height={size}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 16 16">
            <g>
              <title>Layer 1</title>
              <g stroke="null" id="svg_12">
                <g
                  stroke="null"
                  transform="matrix(0.08323892802615739,0,0,0.08268738295565478,-323.2631486270222,-252.59941803203154) "
                  id="svg_5">
                  <g stroke="null" id="svg_6">
                    <path
                      stroke="null"
                      id="svg_7"
                      d="m3971.376296,3202.788971l-73.8,0l0,-62.4l37.1,0l0,-14.1l-41.5,0c-5.3,0 -9.7,4.3 -9.7,9.7l0,71.2c0,5.3 4.3,9.7 9.7,9.7l80.1,0l0,-14.1c-0.8,0 -1.3,0 -1.7,0l-0.2,0z"
                    />
                  </g>
                  <g stroke="null" id="svg_8">
                    <path
                      stroke="null"
                      id="svg_9"
                      d="m4066.576296,3087.288971l-80.1,0l0,14.1c0.8,0 1.3,0 1.7,0l0.2,0l73.8,0l0,62.4l-37.1,0l0,14.1l41.5,0c5.3,0 9.7,-4.3 9.7,-9.7l0,-71.2c0,-5.4 -4.4,-9.7 -9.7,-9.7z"
                    />
                  </g>
                  <g stroke="null" id="svg_10">
                    <path
                      stroke="null"
                      id="svg_11"
                      d="m3996.676296,3126.388971l-28.9,0l0,-39.1l-4.4,0c-5.3,0 -9.7,4.3 -9.7,9.7l0,71.2c0,5.3 4.3,9.7 9.7,9.7l4.4,0l5.8,0l0,-14.1l-5.8,0l0,-23.3l24.5,0l0,76.5l4.4,0c5.3,0 9.7,-4.3 9.7,-9.7l0,-71.2c0,-5.4 -4.3,-9.7 -9.7,-9.7z"
                    />
                  </g>
                </g>
              </g>
            </g>
          </svg>
        );
      case "WalletConnect":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size}>
            <title>WalletConnect</title>
            <g>
              <g fillRule="evenodd" fill="none" id="Page-1">
                <g stroke="null" fillRule="nonzero" fill="#3B99FC" id="walletconnect-logo-alt">
                  <path
                    stroke="null"
                    id="WalletConnect"
                    d="m3.593132,5.29401c2.433855,-2.382947 6.379913,-2.382947 8.813767,0l0.292919,0.286792c0.121693,0.119147 0.121693,0.312323 0,0.431471l-1.002015,0.981056c-0.060846,0.059574 -0.159498,0.059574 -0.220344,0l-0.40309,-0.394659c-1.697918,-1.662403 -4.450786,-1.662403 -6.148704,0l-0.431677,0.422648c-0.060846,0.059573 -0.159498,0.059573 -0.220344,0l-1.002015,-0.981056c-0.121693,-0.119147 -0.121693,-0.312324 0,-0.431471l0.321504,-0.31478zm10.886029,2.028928l0.891796,0.873145c0.121692,0.119147 0.121693,0.312322 0.000001,0.431469l-4.021167,3.93712c-0.121692,0.119148 -0.318995,0.119149 -0.440688,0.000003c0,0 -0.000001,-0.000001 -0.000002,-0.000001l-2.85398,-2.794289c-0.030423,-0.029787 -0.079749,-0.029787 -0.110172,0c0,0 0,0 0,0.000001l-2.853919,2.794286c-0.121692,0.119148 -0.318995,0.11915 -0.440688,0.000004c-0.000001,0 -0.000001,-0.000001 -0.000002,-0.000002l-4.021279,-3.937171c-0.121693,-0.119147 -0.121693,-0.312324 0,-0.431471l0.891797,-0.873144c0.121693,-0.119147 0.318996,-0.119147 0.440688,0l2.854021,2.794327c0.030423,0.029787 0.079749,0.029787 0.110172,0c0,0 0.000001,-0.000001 0.000001,-0.000001l2.853878,-2.794326c0.12169,-0.11915 0.318993,-0.119155 0.440688,-0.00001c0.000002,0.000001 0.000003,0.000003 0.000005,0.000005l2.854017,2.794331c0.030423,0.029787 0.079749,0.029787 0.110172,0l2.853972,-2.794276c0.121693,-0.119147 0.318996,-0.119147 0.440688,0z"
                  />
                </g>
              </g>
            </g>
          </svg>
        );
      case "Coinbase":
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="122" height="28" viewBox="0 0 122 28">
            <path
              style={{ fill: "white" }}
              fillRule="evenodd"
              d="M10.34 23.89c.93 0 1.8-.17 2.62-.5 0 .03 1.67 2.62 1.7 2.63a9.88 9.88 0 0 1-4.81 1.17C4.72 27.2 1 23.81 1 18.42c0-5.43 3.9-8.8 8.85-8.8 1.75 0 3.14.38 4.53 1.12l-1.6 2.7c-.84-.33-1.7-.48-2.6-.48-3.03 0-5.38 1.93-5.38 5.46 0 3.34 2.27 5.47 5.54 5.47zM23.27 9.62c5.04 0 8.69 3.57 8.69 8.8 0 5.2-3.65 8.77-8.7 8.77-5 0-8.65-3.57-8.65-8.77 0-5.23 3.65-8.8 8.66-8.8zm0 3.22c-2.81 0-4.86 2.17-4.86 5.58 0 3.38 2.05 5.55 4.86 5.55 2.88 0 4.9-2.17 4.9-5.55 0-3.41-2.02-5.58-4.9-5.58zm11.08 13.97V10h3.76V26.8h-3.76zm-.5-21.98a2.36 2.36 0 0 1 4.71 0 2.4 2.4 0 0 1-2.35 2.4 2.4 2.4 0 0 1-2.35-2.4zm7.54 6.23a22.54 22.54 0 0 1 7.7-1.44c4.3 0 7.02 1.63 7.02 6.37v10.82H52.4V16.34c0-2.43-1.51-3.3-3.6-3.3-1.33 0-2.66.18-3.65.49V26.8H41.4V11.06zM59.26 1h3.76v9.45c.8-.42 2.35-.83 3.83-.83 4.86 0 8.5 3.1 8.5 8.5 0 5.43-3.6 9.07-9.82 9.07-2.43 0-4.56-.5-6.27-1.1V1zm3.76 22.62c.72.23 1.67.35 2.62.35 3.45 0 5.92-1.9 5.92-5.77 0-3.27-2.32-5.2-5.16-5.2-1.48 0-2.62.38-3.38.8v9.82zm23.2-8.08c0-1.82-1.38-2.66-3.24-2.66-1.93 0-3.45.57-4.85 1.37v-3.27a11.21 11.21 0 0 1 5.46-1.36c3.68 0 6.3 1.52 6.3 5.73v11.12c-1.6.42-3.87.68-5.77.68-4.36 0-7.55-1.32-7.55-5.12 0-3.42 2.92-5.09 7.78-5.09h1.86v-1.4zm0 3.9h-1.6c-2.62 0-4.33.77-4.33 2.48 0 1.74 1.6 2.42 3.87 2.42.57 0 1.37-.07 2.05-.18v-4.71zm6.4 2.82a8.82 8.82 0 0 0 5.13 1.9c1.67 0 2.77-.57 2.77-1.9 0-1.37-.99-1.86-3.15-2.43-3.5-.8-4.97-2.2-4.97-5.13 0-3.41 2.58-5.08 6-5.08 1.9 0 3.41.41 4.82 1.29v3.45a7.79 7.79 0 0 0-4.71-1.7c-1.63 0-2.5.8-2.5 1.9 0 1.1.71 1.66 2.65 2.2 3.84.83 5.5 2.27 5.5 5.3 0 3.54-2.69 5.13-6.33 5.13a9.87 9.87 0 0 1-5.2-1.36v-3.57zm16.69-3v.07c.23 3 2.8 4.64 5.43 4.64 2.31 0 3.98-.54 5.65-1.64v3.3c-1.52 1.07-3.76 1.56-5.92 1.56-5.24 0-8.8-3.34-8.8-8.65 0-5.35 3.49-8.92 8.12-8.92 4.9 0 7.21 3.15 7.21 7.74v1.9h-11.7zm8.16-2.43c-.08-2.62-1.37-4.06-3.8-4.06-2.16 0-3.75 1.52-4.25 4.06h8.05z"
            />
          </svg>
        );
      case "Gemini":
        return (
          <svg width="797.20001" height="173.00002" viewBox="0 0 210.92582 45.772921" version="1.1" id="svg1760">
            <g id="layer1" transform="translate(309.17318,-194.34167)">
              <g id="g1811" transform="translate(0.39688112,-0.39687465)">
                <g
                  style={{ fill: "#000000" }}
                  transform="matrix(0.26458333,0,0,0.26458333,-309.17318,195.13542)"
                  id="g1774">
                  <path
                    id="path1762"
                    d="m 273.8,93.2 h 32.6 v 21.6 c -7,4.2 -16.5,6.8 -25.7,6.8 -23.2,0 -38.8,-15 -38.8,-37.4 0,-22.6 15.4,-37.8 38.2,-37.8 12.3,0 22.2,3.7 31.2,11.5 l 1.3,1.2 9.4,-15 -1,-0.8 c -11.9,-10 -25.4,-14.9 -41.1,-14.9 -15.9,0 -30.3,5.2 -40.6,14.7 -11,10.1 -16.8,24.3 -16.8,41 0,32.6 23.6,55.4 57.4,55.4 15.5,0 34.5,-6 45.1,-14.2 l 0.6,-0.5 V 76.1 h -51.7 v 17.1 z"
                    style={{ fill: "white" }}
                  />

                  <polygon
                    id="polygon1764"
                    points="432.9,138 432.9,120.8 366.7,120.8 366.7,90.8 421.6,90.8 421.6,73.6 366.7,73.6 366.7,47.1 432.9,47.1 432.9,29.9 348.3,29.9 348.3,138 "
                    style={{ fill: "white" }}
                  />

                  <polygon
                    id="polygon1766"
                    points="555.1,29.9 513,80.5 471,29.9 454.1,29.9 454.1,138 473.2,138 473.2,61.1 510.7,106.3 515.2,106.3 552.7,61.1 552.7,138 571.8,138 571.8,29.9 "
                    style={{ fill: "white" }}
                  />

                  <rect id="rect1768" height="108.1" width="19.1" style={{ fill: "white" }} y="29.9" x="599.90002" />

                  <polygon
                    id="polygon1770"
                    points="663.9,30.4 663.4,29.9 647,29.9 647,138 666.1,138 666.1,61.2 730.3,137.5 730.8,138 747.1,138 747.1,29.9 728,29.9 728,107 "
                    style={{ fill: "white" }}
                  />

                  <rect id="rect1772" height="108.1" width="19.1" style={{ fill: "white" }} y="29.9" x="775.09998" />
                </g>
                <path
                  id="path1776"
                  d="m -279.77797,195.13542 c -7.91104,0 -14.63146,6.08542 -15.47813,13.91708 -7.83166,0.84667 -13.91708,7.56709 -13.91708,15.47813 0,8.59896 6.985,15.58396 15.58396,15.58396 7.91104,0 14.65791,-6.08542 15.47812,-13.91709 7.83167,-0.84666 13.91709,-7.56708 13.91709,-15.47812 0,-8.59896 -6.985,-15.58396 -15.58396,-15.58396 z m 11.93271,17.33021 c -0.7673,5.21229 -4.94771,9.39271 -10.16,10.16 v -10.16 z m -37.67667,10.31875 c 0.76729,-5.23875 4.94771,-9.41917 10.16,-10.18646 v 10.16 h -10.16 z m 23.86542,3.51896 c -0.87313,5.9002 -5.92667,10.29229 -11.93271,10.29229 -6.00604,0 -11.05959,-4.39209 -11.93271,-10.29229 z m 0.13229,-13.83771 v 10.29229 h -10.31875 v -10.29229 z m 13.67896,-3.51896 h -23.86542 c 0.87312,-5.90021 5.92667,-10.29229 11.93271,-10.29229 6.00604,0 11.05958,4.39208 11.93271,10.29229 z"
                  style={{ fill: "#00dcfa", strokeWidth: "0.26458332" }}
                />
              </g>
            </g>
          </svg>
        );
      case "ledger":
        return (
          <svg
            className="HydroSDK-themeSvg"
            xmlns="http://www.w3.org/2000/svg"
            width={size}
            height={size}
            viewBox="0 0 16 16">
            <path
              fill="#000"
              fillRule="nonzero"
              d="M13.129.5H6.207v9.259h9.29v-6.85C15.5 1.609 14.432.5 13.128.5zM4.082.5H2.92C1.616.5.5 1.56.5 2.913V4.07h3.582V.5zM.5 6.238h3.582v3.57H.5v-3.57zm11.418 9.258h1.161c1.305 0 2.421-1.06 2.421-2.412V11.93h-3.582v3.566zm-5.71-3.566h3.581v3.57H6.207v-3.57zm-5.708 0v1.157c0 1.3 1.063 2.413 2.42 2.413h1.162v-3.57H.5z"
            />
          </svg>
        );
      case 'dcent':
        return (
          <svg version="1.1" xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" width="16px" height="16px" viewBox="0 0 16 16" enableBackground="new 0 0 16 16" >  
          <image width="16" height="16" x="0" y="0"
            href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAMAAABEpIrGAAAAIGNIUk0AAHomAACAhAAA+gAAAIDo
            AAB1MAAA6mAAADqYAAAXcJy6UTwAAALKUExURQAAAG7JxKOnqW1vcaWpq42QkqSoqm2FhW5wcm1u
            cGFiZG7JxG7JxG3JxKKoqaOnqaOnqW7JxG7JxG7JxG7JxG3KxKOnqaOnqaOnqW7JxG7JxG7JxG7J
            xKOnqaOnqW7JxG7JxG7JxG7JxG7JxG7JxG7JxKOnqaOnqaOnqW7JxG7JxG7JxG7JxG3JxKOnqaOn
            qaOnqaOnqaOnqaOnqaOnqW7JxG7JxG7JxG7JxKikp6SmqKOnqaOnqaOnqaOnqaOnqW7JxG7JxG7J
            xG7JxKOnqaOnqaOnqaOnqaOnqW7JxG7JxG7JxG7JxG7JxG7JxKOnqaOnqaOnqaOnqW7JxG7JxG7J
            xG7JxKOnqaOnqaOnqW7JxG7JxG7JxJeanKOnqaOnqaOnqW7JxG1vcWxucHJ0dqGlp6OnqW7JxG7J
            xG1vcW1vcW1vcW1vcX6Bg6OnqaOnqaOnqW1vcW1vcW1vcW1vcW1vcW1vcaOnqaOnqaOnqW1vcW1v
            caOnqaOnqW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW7KxW7Gwm1sbm1vcW1vcVxe
            YJ6ipKSoqqOnqW7KxW7KxW6enG1vcW1vcW1vcW1vcW1vcW1vcW1vcWxucH+Bg6OnqaSoqm7JxG7J
            xG7Lxm60sW1ydG1ucG1vcW1vcW1vcW1vcW1vcW1vcY2QkqSoqqOnqaOnqW7NyG6+uW19fm1tcG1v
            cW1vcW1vcW1vcW1vcWxucHBydJaanKWpq21rbW1ucW1vcW1vcW1vcW1vcW1vcW1vcWttb21vcW1v
            cW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1v
            cW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcW1vcaOnqW7JxG1vcf//
            /4C04gYAAADqdFJOUwAAAAAAAAAAAAAAD3GFeX8UBUGz+6CLoQgBKZbuyA0Wdt4KVsf8pyURAzqs
            9qFteBaMvEUFI43q7wgCku+ZLAFi2f74A53gcgcV1f3OXg0mkeQjF+N+G3Hb5/SeLwdTxfwJAzlx
            g+upAiCI7LUIN6j1EGjV/rQFCVLEk/wVr7MG+o/9zl8N538b32YIMwEGUs797phUla1BBAI2pahX
            g+IY0rdbeNrtlCiH6IxVodonDVVnw910FmfU1XZSEiS9xlUJSbvNNxd23vWrovHlgx4plu7zo0L4
            +8BNCGDP2GwS4+ojMJ7wqjliCxcPZj0AAAABYktHRO1WvoONAAAAB3RJTUUH4wgPBSgP/z7pywAA
            AF50RVh0UmF3IHByb2ZpbGUgdHlwZSBpcHRjAAppcHRjCiAgICAgIDI4CjM4NDI0OTRkMDQwNDAw
            MDAwMDAwMDAwZjFjMDI2ZTAwMDM1MjQ2NDcxYzAyMDAwMDAyMDAwNDAwCmCaPZ4AAAIVSURBVDjL
            Y2BAAEZGbh5ePn4BJiYGrIBRUEhYRFTslbgEVgWMklLSMq9fAxXIymFRwMgor6D4+jUuBYyMSsoq
            qq+hCtSAVjAxqWsgnMKoqaWt8xoCdPX0DZhACgyNjE2YoNpNzcyh0q8teCytQMJMTNavbGzt7JlA
            2h0cnaDSzsJCgoxgXUwurq9evXJz92BiYPT0gkp7+/j6MYLlmZj8A2yACl4FBgEVBDtC5ENCw2DS
            AuERr8Ag0h+uICo6RhIszcwSGxef8ApDgXAixHLmpOSU1LRXmArSM0AKmJkzs7JzcvPyC7AqYGYu
            LCoueVNaxlpeUZmATUFSVfWbN0AFzExMNbXYFJTVvYEoAPokAI+CemZwSOJS0NCYhE9BU3NLKzMe
            BW3tHUBpBgY2dAWdXd3szMxlLT29zODg4ujrnzARoWDS5ClTp02fwcwMkWZgnjlr9py58+ZDFCxY
            uGjxkqVv3ixbvgKqnTlzZdubN6tWr1m7bj1QwYaNmzaDwufNmy1btzEDQeH2HSUgbsnOXbv3AFMM
            5959YD4QVO8/cLD+0OEGKPfNkaMcXCATjx0/ARM6eer0GRj77LnzzFA39V64eOkNGrh8pWcmMzzd
            M5ddzbmGLH39xs1bzMg5g5m59fadJph0yd1795mZ0TIPM3NH+wOI/MPVjzCkIcHz+MlToDufPU/C
            Jg1WcuvAji0vXqJoBwCwsI9N5H6RoQAAACV0RVh0ZGF0ZTpjcmVhdGUAMjAxOS0wOC0xNVQwNTo0
            MDoxNSswMzowMAGdVpkAAAAldEVYdGRhdGU6bW9kaWZ5ADIwMTktMDgtMTVUMDU6NDA6MTUrMDM6
            MDBwwO4lAAAAAElFTkSuQmCC" />
          </svg>
        )
      case 'coinbase':
        return (
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 30 30" fill="none">
          <path fillRule="evenodd" clipRule="evenodd" d="M15 -8.9407e-07C6.71573 -8.9407e-07 0 6.71573 0 15C0 23.2843 6.71573 30 15 30C23.2843 30 30 23.2843 30 15C30 6.71573 23.2843 -8.9407e-07 15 -8.9407e-07Z" fill="url(#paint0_linear)"/>
          <path fillRule="evenodd" clipRule="evenodd" d="M6.16229 15C6.16229 10.1191 10.1191 6.16232 15 6.16232C19.8809 6.16232 23.8377 10.1191 23.8377 15C23.8377 19.8809 19.8809 23.8377 15 23.8377C10.1191 23.8377 6.16229 19.8809 6.16229 15ZM12.7415 17.8477C12.4161 17.8477 12.1523 17.5839 12.1523 17.2585V12.7415C12.1523 12.4161 12.4161 12.1523 12.7415 12.1523H17.2585C17.5839 12.1523 17.8477 12.4161 17.8477 12.7415V17.2585C17.8477 17.5839 17.5839 17.8477 17.2585 17.8477H12.7415Z" fill="white"/>
          <defs>
            <linearGradient id="paint0_linear" x1="15" y1="30" x2="15" y2="0" gradientUnits="userSpaceOnUse">
            <stop stopColor="#2E66F8"/>
            <stop offset="1" stopColor="#124ADB"/>
            </linearGradient>
          </defs>
        </svg>)
      default:
        return null;
    }
  }
}

export default Svg;
