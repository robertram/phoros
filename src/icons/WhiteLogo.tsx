import * as React from "react"

const WhiteLogo = (props: any) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    // width={389}
    // height={60}
    fill="none"
    viewBox="0 0 400 60"
    {...props}
  >
    <path
      fill="#fff"
      d="M57.39 44.54c-4.248 0-7.524-1.224-9.828-3.672-2.268-2.484-3.402-6.12-3.402-10.908 0-4.752 1.098-8.37 3.294-10.854 2.232-2.484 5.364-3.726 9.396-3.726 1.872 0 3.852.198 5.94.594.504.108.918.378 1.242.81.36.396.54.864.54 1.404 0 .432-.198.774-.594 1.026-.36.252-.756.324-1.188.216a22.864 22.864 0 0 0-5.67-.702c-5.76 0-8.64 3.744-8.64 11.232 0 3.888.756 6.732 2.268 8.532 1.512 1.8 3.816 2.7 6.912 2.7 2.016 0 3.852-.27 5.508-.81.396-.144.774-.09 1.134.162.36.252.54.594.54 1.026a2.37 2.37 0 0 1-.486 1.458c-.324.432-.756.72-1.296.864-1.692.432-3.582.648-5.67.648Zm16.965-1.134a1.982 1.982 0 0 1-1.458.594c-.576 0-1.08-.198-1.512-.594a1.982 1.982 0 0 1-.594-1.458V5.552c0-.576.198-1.062.594-1.458a2.167 2.167 0 0 1 1.512-.594c.576 0 1.062.198 1.458.594.396.396.594.882.594 1.458v14.58c0 .036.018.054.054.054.036 0 .072-.018.108-.054 2.592-3.168 5.598-4.752 9.018-4.752 3.276 0 5.652.918 7.128 2.754 1.476 1.8 2.214 4.842 2.214 9.126v14.688c0 .576-.198 1.062-.594 1.458-.36.396-.828.594-1.404.594a1.982 1.982 0 0 1-1.458-.594 1.982 1.982 0 0 1-.594-1.458V27.962c0-3.636-.486-6.066-1.458-7.29-.936-1.26-2.574-1.89-4.914-1.89-1.872 0-3.69.9-5.454 2.7-1.764 1.764-2.646 3.582-2.646 5.454v15.012c0 .576-.198 1.062-.594 1.458Zm35.333-24.894c-5.004 0-7.74 2.97-8.208 8.91 0 .288.162.432.486.432h14.526c.288 0 .432-.144.432-.432-.216-5.94-2.628-8.91-7.236-8.91Zm1.134 26.028c-4.428 0-7.794-1.206-10.098-3.618-2.304-2.448-3.456-6.102-3.456-10.962 0-5.004 1.098-8.676 3.294-11.016 2.232-2.376 5.274-3.564 9.126-3.564 7.092 0 10.854 4.194 11.286 12.582.036.864-.27 1.602-.918 2.214-.612.576-1.35.864-2.214.864h-15.984c-.288 0-.432.162-.432.486.324 6.588 3.582 9.882 9.774 9.882 2.052 0 4.158-.378 6.318-1.134.396-.144.774-.09 1.134.162.36.216.54.54.54.972 0 1.224-.558 1.98-1.674 2.268-2.304.576-4.536.864-6.696.864Zm26.361 0c-4.248 0-7.524-1.224-9.828-3.672-2.268-2.484-3.402-6.12-3.402-10.908 0-4.752 1.098-8.37 3.294-10.854 2.232-2.484 5.364-3.726 9.396-3.726 1.872 0 3.852.198 5.94.594.504.108.918.378 1.242.81.36.396.54.864.54 1.404 0 .432-.198.774-.594 1.026-.36.252-.756.324-1.188.216a22.864 22.864 0 0 0-5.67-.702c-5.76 0-8.64 3.744-8.64 11.232 0 3.888.756 6.732 2.268 8.532 1.512 1.8 3.816 2.7 6.912 2.7 2.016 0 3.852-.27 5.508-.81.396-.144.774-.09 1.134.162.36.252.54.594.54 1.026a2.37 2.37 0 0 1-.486 1.458c-.324.432-.756.72-1.296.864-1.692.432-3.582.648-5.67.648Zm16.911-1.134a1.982 1.982 0 0 1-1.458.594 1.982 1.982 0 0 1-1.458-.594 1.982 1.982 0 0 1-.594-1.458V5.552c0-.576.198-1.062.594-1.458a1.982 1.982 0 0 1 1.458-.594c.576 0 1.062.198 1.458.594.396.396.594.882.594 1.458v22.842c0 .036.018.054.054.054l.108-.054 11.664-10.746c1.224-1.152 2.7-1.728 4.428-1.728.468 0 .774.216.918.648.18.432.108.792-.216 1.08l-12.528 11.448c-.216.216-.234.432-.054.648l12.744 12.474c.288.288.342.666.162 1.134-.18.432-.486.648-.918.648-1.692 0-3.132-.594-4.32-1.782l-11.88-11.772c-.036-.036-.072-.054-.108-.054-.036 0-.054.018-.054.054v11.502c0 .576-.198 1.062-.594 1.458Zm25.89 0a1.982 1.982 0 0 1-1.458.594c-.576 0-1.08-.198-1.512-.594a1.982 1.982 0 0 1-.594-1.458v-24.03c0-.54.198-1.008.594-1.404a1.92 1.92 0 0 1 1.404-.594c.54 0 1.008.198 1.404.594.396.396.594.864.594 1.404l.054 1.782c0 .036.018.054.054.054.072 0 .108-.036.108-.108 2.052-2.844 4.5-4.266 7.344-4.266 1.728 0 3.114.378 4.158 1.134 1.08.756 1.962 2.016 2.646 3.78 0 .072.018.108.054.108.072 0 .108-.036.108-.108 2.016-3.276 4.644-4.914 7.884-4.914 2.88 0 4.95.828 6.21 2.484 1.296 1.656 1.944 4.428 1.944 8.316v15.768c0 .576-.198 1.062-.594 1.458-.36.396-.828.594-1.404.594a1.982 1.982 0 0 1-1.458-.594 1.982 1.982 0 0 1-.594-1.458V27.26c0-3.348-.396-5.616-1.188-6.804-.756-1.224-2.106-1.836-4.05-1.836-1.332 0-2.646.72-3.942 2.16-1.296 1.404-1.944 2.862-1.944 4.374v16.794c0 .576-.198 1.062-.594 1.458a1.982 1.982 0 0 1-1.458.594 1.982 1.982 0 0 1-1.458-.594 1.982 1.982 0 0 1-.594-1.458V27.26c0-3.348-.396-5.616-1.188-6.804-.756-1.224-2.088-1.836-3.996-1.836-1.332 0-2.664.72-3.996 2.16-1.296 1.404-1.944 2.862-1.944 4.374v16.794c0 .576-.198 1.062-.594 1.458Zm43.234-.054-9.45-25.38c-.18-.504-.126-.972.162-1.404a1.54 1.54 0 0 1 1.296-.648 2.72 2.72 0 0 1 1.728.594c.54.36.918.846 1.134 1.458l7.398 21.006c0 .036.018.054.054.054.072 0 .108-.018.108-.054l8.154-21.114a2.973 2.973 0 0 1 1.08-1.404c.54-.36 1.134-.54 1.782-.54.504 0 .882.216 1.134.648.288.396.342.828.162 1.296l-14.85 36.072a3.205 3.205 0 0 1-1.188 1.404c-.504.36-1.08.54-1.728.54-.504 0-.882-.216-1.134-.648-.252-.396-.288-.828-.108-1.296l4.266-9.72a1.192 1.192 0 0 0 0-.864Z"
    />
    <path
      fill="#6E3DD9"
      d="M246.078 22.602a3.049 3.049 0 0 1-2.16-.864c-.612-.612-.918-1.332-.918-2.16 0-.828.306-1.548.918-2.16.612-.612 1.332-.918 2.16-.918h2.16c.288 0 .432-.162.432-.486V9.318c0-.828.306-1.548.918-2.16.612-.612 1.332-.918 2.16-.918h2.592c.828 0 1.548.306 2.16.918.612.612.918 1.332.918 2.16v6.696c0 .324.162.486.486.486h5.292c.828 0 1.53.306 2.106.918.612.612.918 1.332.918 2.16 0 .828-.306 1.548-.918 2.16-.576.576-1.278.864-2.106.864h-5.292c-.324 0-.486.162-.486.486v9.234c0 2.268.198 3.708.594 4.32.432.612 1.368.918 2.808.918.756 0 1.35-.036 1.782-.108.792-.108 1.494.072 2.106.54.612.468.918 1.08.918 1.836v.432c0 .9-.288 1.692-.864 2.376a3.309 3.309 0 0 1-2.214 1.188c-1.116.144-2.412.216-3.888.216-3.672 0-6.264-.774-7.776-2.322-1.476-1.584-2.214-4.41-2.214-8.478V23.088c0-.324-.144-.486-.432-.486h-2.16ZM275.082 43.5c-.828 0-1.548-.306-2.16-.918-.612-.612-.918-1.332-.918-2.16V18.498c0-.828.306-1.548.918-2.16.612-.612 1.332-.918 2.16-.918h3.024c.828 0 1.548.306 2.16.918.612.612.918 1.332.918 2.16v21.924c0 .828-.306 1.548-.918 2.16-.612.612-1.332.918-2.16.918h-3.024Zm0-33.48c-.828 0-1.548-.306-2.16-.918-.612-.612-.918-1.332-.918-2.16v-.864c0-.828.306-1.548.918-2.16.612-.612 1.332-.918 2.16-.918h3.024c.828 0 1.548.306 2.16.918.612.612.918 1.332.918 2.16v.864c0 .828-.306 1.548-.918 2.16-.612.612-1.332.918-2.16.918h-3.024Zm24.384 34.02c-4.644 0-8.208-1.224-10.692-3.672-2.484-2.448-3.726-6.084-3.726-10.908 0-4.716 1.188-8.316 3.564-10.8 2.412-2.52 5.85-3.78 10.314-3.78 1.476 0 3.438.162 5.886.486.9.144 1.62.558 2.16 1.242.576.648.864 1.422.864 2.322v.54c0 .756-.306 1.368-.918 1.836a2.476 2.476 0 0 1-2.052.486 27.235 27.235 0 0 0-4.59-.378c-2.052 0-3.582.648-4.59 1.944-.972 1.26-1.458 3.294-1.458 6.102 0 2.88.522 4.95 1.566 6.21 1.08 1.224 2.754 1.836 5.022 1.836 1.692 0 3.204-.144 4.536-.432.756-.18 1.422-.036 1.998.432.612.468.918 1.08.918 1.836v.54c0 .9-.288 1.71-.864 2.43a3.498 3.498 0 0 1-2.16 1.242c-1.98.324-3.906.486-5.778.486Zm16.279-.54c-.828 0-1.548-.306-2.16-.918a3.049 3.049 0 0 1-.864-2.16V6.078c0-.828.288-1.548.864-2.16.612-.612 1.332-.918 2.16-.918h2.646c.828 0 1.53.306 2.106.918.612.612.918 1.332.918 2.16v19.926c0 .036.018.054.054.054l.108-.054 6.75-8.208c1.296-1.584 2.952-2.376 4.968-2.376h3.888c.576 0 .99.27 1.242.81.288.54.234 1.044-.162 1.512l-9.234 10.854c-.18.216-.18.45 0 .702l9.342 11.826c.36.504.396 1.026.108 1.566-.252.54-.684.81-1.296.81h-3.888c-2.016 0-3.654-.81-4.914-2.43l-6.804-8.856c-.036-.036-.072-.054-.108-.054-.036 0-.054.018-.054.054v8.208c0 .828-.306 1.548-.918 2.16-.576.612-1.278.918-2.106.918h-2.646Zm35.632-22.734c-1.62 0-2.844.432-3.672 1.296-.828.828-1.35 2.268-1.566 4.32 0 .288.126.432.378.432h9.126c.324 0 .486-.162.486-.486-.144-3.708-1.728-5.562-4.752-5.562Zm1.35 23.274c-4.896 0-8.676-1.242-11.34-3.726-2.628-2.484-3.942-6.102-3.942-10.854 0-4.716 1.17-8.316 3.51-10.8 2.376-2.52 5.796-3.78 10.26-3.78 8.568 0 12.924 4.68 13.068 14.04 0 .864-.342 1.602-1.026 2.214a3.307 3.307 0 0 1-2.268.864h-14.418c-.36 0-.504.162-.432.486.288 1.98 1.044 3.402 2.268 4.266 1.26.828 3.132 1.242 5.616 1.242 1.62 0 3.366-.234 5.238-.702.756-.18 1.422-.036 1.998.432.612.468.918 1.08.918 1.836v.108c0 .9-.288 1.728-.864 2.484-.54.72-1.242 1.152-2.106 1.296a34.708 34.708 0 0 1-6.48.594Zm15.589-21.438a3.049 3.049 0 0 1-2.16-.864c-.612-.612-.918-1.332-.918-2.16 0-.828.306-1.548.918-2.16.612-.612 1.332-.918 2.16-.918h2.16c.288 0 .432-.162.432-.486V9.318c0-.828.306-1.548.918-2.16.612-.612 1.332-.918 2.16-.918h2.592c.828 0 1.548.306 2.16.918.612.612.918 1.332.918 2.16v6.696c0 .324.162.486.486.486h5.292c.828 0 1.53.306 2.106.918.612.612.918 1.332.918 2.16 0 .828-.306 1.548-.918 2.16-.576.576-1.278.864-2.106.864h-5.292c-.324 0-.486.162-.486.486v9.234c0 2.268.198 3.708.594 4.32.432.612 1.368.918 2.808.918.756 0 1.35-.036 1.782-.108.792-.108 1.494.072 2.106.54.612.468.918 1.08.918 1.836v.432c0 .9-.288 1.692-.864 2.376a3.309 3.309 0 0 1-2.214 1.188c-1.116.144-2.412.216-3.888.216-3.672 0-6.264-.774-7.776-2.322-1.476-1.584-2.214-4.41-2.214-8.478V23.088c0-.324-.144-.486-.432-.486h-2.16Z"
    />
    <path
      fill="#6E3DD9"
      fillRule="evenodd"
      d="M24 0c-.552 0-.991.451-1.082.996a6.002 6.002 0 0 1-11.836 0C10.992.45 10.552 0 10 0H1a1 1 0 0 0-1 1v58a1 1 0 0 0 1 1h9c.552 0 .991-.451 1.082-.996a6.002 6.002 0 0 1 11.836 0c.09.545.53.996 1.082.996h9a1 1 0 0 0 1-1V1a1 1 0 0 0-1-1h-9Zm-7 19c6.075 0 11 4.925 11 11s-4.925 11-11 11S6 36.075 6 30s4.925-11 11-11Z"
      clipRule="evenodd"
    />
    <path
      fill="#6E3DD9"
      fillRule="evenodd"
      d="M24.129 26.012a1.5 1.5 0 0 1-.141 2.117l-8 7a1.5 1.5 0 0 1-2.111-.135l-3-3.389a1.5 1.5 0 0 1 2.246-1.988l2.012 2.272 6.877-6.018a1.5 1.5 0 0 1 2.117.141Z"
      clipRule="evenodd"
    />
  </svg>
)
export default WhiteLogo
