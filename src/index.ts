import { Cloudinary, Configuration, Transformation } from 'cloudinary-core'

export type ElementOrString = Element | string
export type Size = { width: number; height: number }
export type BindType = ElementOrString | true
export type BindObject = BindType | { width?: BindType; height?: BindType }

export type InitParameters = { debug?: boolean }
export type ImageParameters = {
  src: string
  options?: Transformation | Transformation.Options
  bind?: BindObject
  lazy?: boolean | IntersectionObserverInit
  step?: number
}

let cl: Cloudinary | null = null
let DEBUG: boolean = false

function log(...msg: any[]) {
  if (DEBUG) console.debug(...msg)
}

export function initialize(cloudinary: Configuration.Options, options: InitParameters = {}) {
  DEBUG = options.debug || false
  cl = Cloudinary.new(cloudinary)
}

const defaults: Transformation | Transformation.Options = {
  fetchFormat: 'auto',
  quality: 'auto:good',
}

function calculateApproxRealSize(size: string, step: number): number {
  const withRatio = (parseInt(size) * window.devicePixelRatio) | 0
  const approx = withRatio - (withRatio % step) + step
  log('Size', withRatio, approx, step)
  return approx
}

function getSizeOfElement(el: Element, step: number): Size {
  const styles = window.getComputedStyle(el)
  log('GetSizeOfElement', el, styles)
  return {
    width: calculateApproxRealSize(styles.width, step),
    height: calculateApproxRealSize(styles.height, step),
  }
}

function getSizeOfElementOrSelector(node: ElementOrString, elOrString: ElementOrString, step: number): Size {
  if (typeof elOrString === 'string') {
    const search = typeof node === 'string' ? window.document.querySelector(node) : node
    if (!search) throw new Error('Could not find element: ' + node)
    const closest = search.closest(elOrString)
    if (closest) return getSizeOfElement(closest, step)
    else throw new Error('Could not find element: ' + elOrString)
  } else {
    return getSizeOfElement(elOrString, step)
  }
}

export function image(node: HTMLImageElement, parameters: ImageParameters) {
  if (!parameters || !parameters.src) throw new Error('No url provided for cloudinary')

  let { src, options, bind, lazy, step } = parameters
  log('Image Declared', parameters)
  options = options || {}
  step = step ?? 200

  if (!cl) throw new Error('Cloudinary not initialized')
  if (!src) throw new Error('Src must be set in use:image')

  if (bind) {
    if (bind === true) {
      bind = node
    }
    if (!options.crop) options.crop = 'fill'

    if (bind instanceof Element) Object.assign(options, getSizeOfElement(bind, step))
    else if (typeof bind === 'string') {
      Object.assign(options, getSizeOfElementOrSelector(node, bind, step))
    } else if (typeof bind === 'object') {
      if (bind.width) {
        options.width = getSizeOfElementOrSelector(node, bind.width === true ? node : bind.width, step).width
      }
      if (bind.height) {
        options.height = getSizeOfElementOrSelector(node, bind.height === true ? node : bind.height, step).height
      }
    }
  }

  const all: Transformation | Transformation.Options = { ...defaults, ...options }
  const attrs: any = cl.imageTag(parameters.src, all).attributes()
  const replace = () => (node.src = attrs.src)

  if (lazy && typeof IntersectionObserver !== 'undefined') {
    const options: IntersectionObserverInit = lazy === true ? { rootMargin: '25%', threshold: 0 } : lazy
    new IntersectionObserver((entries, observer) => {
      if (entries[0].isIntersecting) {
        observer.disconnect()
        replace()
      }
    }, options).observe(node)
  } else {
    replace()
  }
}
