// import hasRole from './permission/hasRole'
// import hasPermi from './permission/hasPermi'
import copyText from './copy/copyText'
import draggable from './drag/draggable'
import resizable from './resize/resizable'
export default function directive(app) {
  // app.directive('hasRole', hasRole)
  // app.directive('hasPermi', hasPermi)
  app.directive('copyText', copyText)
  app.directive('draggable', draggable)
  app.directive('resizable', resizable)
}