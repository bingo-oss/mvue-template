//import path from 'path'
//import _ from 'lodash'
var path= require('path');
var _=require('lodash');

exports.encodeHtml = function encodeHtml(str) {
  return str.replace(/</g, '&lt;').replace(/>/g, '&gt;')
}

exports.getContext = function getContext(req, res) {
  return { req, res }
}

exports.waitFor = function waitFor(ms) {
  return new Promise(resolve => setTimeout(resolve, ms || 0))
}

// async function promiseFinally(fn, finalFn) {
//   let result
//   try {
//     if (typeof fn === 'function') {
//       result = await fn()
//     } else {
//       result = await fn
//     }
//   } finally {
//     finalFn()
//   }
//   return result
// }

// exports.timeout = function timeout(fn, ms, msg) {
//   let timerId
//   const warpPromise = promiseFinally(fn, () => clearTimeout(timerId))
//   const timerPromise = new Promise((resolve, reject) => {
//     timerId = setTimeout(() => reject(new Error(msg)), ms)
//   })
//   return Promise.race([warpPromise, timerPromise])
// }

exports.urlJoin = function urlJoin() {
  return [].slice
    .call(arguments)
    .join('/')
    .replace(/\/+/g, '/')
    .replace(':/', '://')
}

exports.isUrl = function isUrl(url) {
  return url.indexOf('http') === 0 || url.indexOf('//') === 0
}

exports.promisifyRoute = function promisifyRoute(fn, ...args) {
  // If routes is an array
  if (Array.isArray(fn)) {
    return Promise.resolve(fn)
  }
  // If routes is a function expecting a callback
  if (fn.length === arguments.length) {
    return new Promise((resolve, reject) => {
      fn((err, routeParams) => {
        if (err) {
          reject(err)
        }
        resolve(routeParams)
      }, ...args)
    })
  }
  let promise = fn(...args)
  if (
    !promise ||
    (!(promise instanceof Promise) && typeof promise.then !== 'function')
  ) {
    promise = Promise.resolve(promise)
  }
  return promise
}

exports.sequence = function sequence(tasks, fn) {
  return tasks.reduce(
    (promise, task) => promise.then(() => fn(task)),
    Promise.resolve()
  )
}

exports.parallel = function parallel(tasks, fn) {
  return Promise.all(tasks.map(fn))
}

exports.chainFn = function chainFn(base, fn) {
  /* istanbul ignore if */
  if (typeof fn !== 'function') {
    return base
  }
  return function () {
    if (typeof base !== 'function') {
      return fn.apply(this, arguments)
    }
    let baseResult = base.apply(this, arguments)
    // Allow function to mutate the first argument instead of returning the result
    if (baseResult === undefined) {
      baseResult = arguments[0]
    }
    const fnResult = fn.call(
      this,
      baseResult,
      ...Array.prototype.slice.call(arguments, 1)
    )
    // Return mutated argument if no result was returned
    if (fnResult === undefined) {
      return baseResult
    }
    return fnResult
  }
}

exports.isPureObject = function isPureObject(o) {
  return !Array.isArray(o) && typeof o === 'object'
}

var isWindows = /^win/.test(process.platform)

function wp(p = '') {
  /* istanbul ignore if */
  if (isWindows) {
    return p.replace(/\\/g, '\\\\')
  }
  return p
}

exports.wChunk = function wChunk(p = '') {
  /* istanbul ignore if */
  if (isWindows) {
    return p.replace(/\//g, '_')
  }
  return p
}

const reqSep = /\//g
const sysSep = _.escapeRegExp(path.sep)
const normalize = string => string.replace(reqSep, sysSep)

function r() {
  const args = Array.prototype.slice.apply(arguments)
  const lastArg = _.last(args)

  if (lastArg.indexOf('@') === 0 || lastArg.indexOf('~') === 0) {
    return wp(lastArg)
  }

  return wp(path.resolve(...args.map(normalize)))
}

exports.relativeTo = function relativeTo() {
  const args = Array.prototype.slice.apply(arguments)
  const dir = args.shift()

  // Keep webpack inline loader intact
  if (args[0].indexOf('!') !== -1) {
    const loaders = args.shift().split('!')

    return loaders.concat(relativeTo(dir, loaders.pop(), ...args)).join('!')
  }

  // Resolve path
  const _path = r(...args)

  // Check if path is an alias
  if (_path.indexOf('@') === 0 || _path.indexOf('~') === 0) {
    return _path
  }

  // Make correct relative path
  let rp = path.relative(dir, _path)
  if (rp[0] !== '.') {
    rp = './' + rp
  }

  return wp(rp)
}

exports.flatRoutes = function flatRoutes(router, _path = '', routes = []) {
  router.forEach((r) => {
    if (!r.path.includes(':') && !r.path.includes('*')) {
      /* istanbul ignore if */
      if (r.children) {
        if (_path === '' && r.path === '/') {
          routes.push('/')
        }
        flatRoutes(r.children, _path + r.path + '/', routes)
      } else {
        _path = _path.replace(/^\/+$/, '/')
        routes.push(
          (r.path === '' && _path[_path.length - 1] === '/'
            ? _path.slice(0, -1)
            : _path) + r.path
        )
      }
    }
  })
  return routes
}

function cleanChildrenRoutes(routes, isChild = false) {
  let start = -1
  const routesIndex = []
  routes.forEach((route) => {
    if (/-index$/.test(route.name) || route.name === 'index') {
      // Save indexOf 'index' key in name
      const res = route.name.split('-')
      const s = res.indexOf('index')
      start = start === -1 || s < start ? s : start
      routesIndex.push(res)
    }
  })
  routes.forEach((route) => {
    route.path = isChild ? route.path.replace('/', '') : route.path
    if (route.path.indexOf('?') > -1) {
      const names = route.name.split('-')
      const paths = route.path.split('/')
      if (!isChild) {
        paths.shift()
      } // clean first / for parents
      routesIndex.forEach((r) => {
        const i = r.indexOf('index') - start //  children names
        if (i < paths.length) {
          for (let a = 0; a <= i; a++) {
            if (a === i) {
              paths[a] = paths[a].replace('?', '')
            }
            if (a < i && names[a] !== r[a]) {
              break
            }
          }
        }
      })
      route.path = (isChild ? '' : '/') + paths.join('/')
    }
    route.name = route.name.replace(/-index$/, '')
    if (route.children) {
      if (route.children.find(child => child.path === '')) {
        delete route.name
      }
      route.children = cleanChildrenRoutes(route.children, true)
    }
  })
  return routes
}

exports.createRoutes = function createRoutes(files, srcDir, pagesDir,pageTmplDir) {
  const routes = []
  files.forEach((file) => {
    const keys = file
      .replace(RegExp(`^${pagesDir}`), '')
      .replace(/\.(vue|js)$/, '')
      .replace(/\/{2,}/g, '/')
      .split('/')
      .slice(1)
    const route = { 
      name: '', 
      path: '/pages', 
      component:file.replace(/\.(vue|js)$/, '')
    }
    //js文件对应的组件从模板页面组件产生
    if(file.endsWith('.js')){
      const start=file.lastIndexOf('/')+1;
      const end=file.lastIndexOf('.');
      const len=end-start;
      const fileName=file.substr(start,len);
      route.component=`${pageTmplDir}`;
    }
    let parent = routes
    keys.forEach((key, i) => {
      // remove underscore only, if its the prefix
      const sanitizedKey = key.indexOf('_') === 0
        ? key.replace('_', '')
        : key
      route.name = route.name
        ? route.name + '-' + sanitizedKey
        : sanitizedKey
      route.name += key === '_' ? 'all' : ''
      //route.chunkName = file.replace(/\.(vue|js)$/, '')
      const child = _.find(parent, { name: route.name })
      if (child) {
        child.children = child.children || []
        parent = child.children
        route.path = ''
      } else if (key === 'index' && i + 1 === keys.length) {
        route.path += i > 0 ? '' : '/'
      } else {
        route.path += '/' +
            (key === '_'
              ? '*'
              : key.indexOf('_') === 0
                ? key.replace('_', ':')
                : key)
        if (key !== '_' && key.indexOf('_') === 0) {
          route.path += '?'
        }
      }
    })
    // Order Routes path
    parent.push(route)
    parent.sort((a, b) => {
      if (!a.path.length) {
        return -1
      }
      if (!b.path.length) {
        return 1
      }
      // Order: /static, /index, /:dynamic
      // Match exact route before index: /login before /index/_slug
      if (a.path === '/') {
        return /^\/(:|\*)/.test(b.path) ? -1 : 1
      }
      if (b.path === '/') {
        return /^\/(:|\*)/.test(a.path) ? 1 : -1
      }
      let i = 0
      let res = 0
      let y = 0
      let z = 0
      const _a = a.path.split('/')
      const _b = b.path.split('/')
      for (i = 0; i < _a.length; i++) {
        if (res !== 0) {
          break
        }
        y = _a[i] === '*' ? 2 : _a[i].indexOf(':') > -1 ? 1 : 0
        z = _b[i] === '*' ? 2 : _b[i].indexOf(':') > -1 ? 1 : 0
        res = y - z
        // If a.length >= b.length
        if (i === _b.length - 1 && res === 0) {
          // change order if * found
          res = _a[i] === '*' ? -1 : 1
        }
      }
      return res === 0 ? (_a[i - 1] === '*' && _b[i] ? 1 : -1) : res
    })
  })
  return cleanChildrenRoutes(routes)
}
