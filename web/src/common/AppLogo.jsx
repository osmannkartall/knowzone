import * as React from 'react';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  appLogoTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica',
    lineHeight: 1.2,
    pointerEvents: 'none',
    whiteSpace: 'normal',
    wordWrap: 'normal',
    display: 'inline-block',
    [theme.breakpoints.down('xs')]: {
      display: 'none',
    },
  },
}));

const AppLogo = ({ width, height }) => {
  const classes = useStyles();

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      xmlnsXlink="http://www.w3.org/1999/xlink"
      width={width}
      height={height}
      viewBox="-0.5 -0.5 1718 334"
    >
      <defs>
        <style>
          {
            '\n      @import url(https://fonts.googleapis.com/css?family=Cabin+Condensed);\n    '
          }
        </style>
      </defs>
      <switch transform="translate(-.5 -.5)">
        <foreignObject
          style={{
            overflow: 'visible',
            textAlign: 'left',
          }}
          pointerEvents="none"
          width="100%"
          height="100%"
          requiredFeatures="http://www.w3.org/TR/SVG11/feature#Extensibility"
        >
          <div
            xmlns="http://www.w3.org/1999/xhtml"
            style={{
              display: 'flex',
              alignItems: 'unsafe center',
              justifyContent: 'unsafe center',
              width: 658,
              height: 1,
              paddingTop: 188,
              marginLeft: 714,
            }}
          >
            <div
              style={{
                boxSizing: 'border-box',
                fontSize: 0,
                textAlign: 'center',
              }}
            >
              <div className={classes.appLogoTitle}>
                <p>
                  <font
                    style={{
                      lineHeight: '60%',
                      fontSize: 350,
                    }}
                    data-font-src="https://fonts.googleapis.com/css?family=Cabin+Condensed"
                    color="#1563ff"
                    face="Cabin Condensed"
                  >
                    {'\n                Knowzone\n              '}
                  </font>
                </p>
              </div>
            </div>
          </div>
        </foreignObject>
        <text
          x={1043}
          y={172}
          fontFamily="Helvetica"
          fontSize={12}
          textAnchor="middle"
        >
          Knowzone
        </text>
      </switch>
      <rect
        x={3}
        y={3}
        width={330}
        height={330}
        rx={49.5}
        ry={49.5}
        fill="#1563ff"
        pointerEvents="none"
      />
      <path
        d="M168 273V168.5"
        fill="none"
        stroke="#fff"
        strokeWidth={48}
        strokeMiterlimit={10}
        pointerEvents="none"
      />
      <circle
        cx={168}
        cy={128}
        fill="#fff"
        stroke="#fff"
        strokeWidth={48}
        pointerEvents="none"
        r={40.5}
      />
    </svg>
  );
};

export default AppLogo;
