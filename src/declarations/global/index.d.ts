import {
  RouteConfig,
} from 'vue-router';

declare module '*.css';
declare module '#*';
declare module '*.html';
declare module 'components*';
declare module 'utils*';
declare module 'pages*';
declare module 'url';
declare module 'querystring';
declare module 'declarations*';

declare module '*.json!router-loader' {
  const content: RouteConfig;
  export default content;
}


