import { Cloudinary, Configuration, Transformation } from 'cloudinary-core'

let cl: Cloudinary | null = null

export function initialize(options: Configuration.Options) {
  cl = Cloudinary.new(options)
}

type ElementOrString = Element | string

const defaults: Transformation | Transformation.Options = {
  fetchFormat: 'auto',
  quality: 'auto:good',
}

function calculateApproxRealSize(size: string, step = 200) {
  const withRatio = (parseInt(size) * window.devicePixelRatio) | 0
  return withRatio - (withRatio % step) + step
}

function getSizeOfElement(el: Element) {
  const styles = window.getComputedStyle(el)
  return {
    width: calculateApproxRealSize(styles.width),
    height: calculateApproxRealSize(styles.height),
  }
}

function getSizeOfElementOrSelector(node: ElementOrString, elOrString: ElementOrString) {
  if (typeof elOrString === 'string') {
    const search = typeof node === 'string' ? window.document.querySelector(node) : node
    if (!search) throw new Error('Could not find element: ' + node)
    const closest = search.closest(elOrString)
    if (closest) return getSizeOfElement(closest)
    else throw new Error('Could not find element: ' + elOrString)
  } else {
    return getSizeOfElement(elOrString)
  }
}

type BindType = ElementOrString | true | { width?: ElementOrString; height?: ElementOrString }

export type ImageParameters = {
  src: string
  options?: Transformation | Transformation.Options
  bind?: BindType
}

export function image(node: HTMLImageElement, parameters?: ImageParameters) {
  if (!parameters) throw new Error('No url provided for cloudinary')

  let { src, options, bind } = parameters
  options = options || {}

  if (!cl) throw new Error('Cloudinary not initialized')
  if (!src) throw new Error('Src must be set in use:image')

  if (bind) {
    if (bind === true) {
      bind = node
    }

    if (bind instanceof Element) Object.assign(options, getSizeOfElement(bind))
    else if (typeof bind === 'string') {
      Object.assign(options, getSizeOfElementOrSelector(node, bind))
    } else if (typeof bind === 'object') {
      if (bind.width) {
        options.width = getSizeOfElementOrSelector(node, bind.width).width
      }
      if (bind.height) {
        options.height = getSizeOfElementOrSelector(node, bind.height).height
      }
    }
  }

  const all: Transformation | Transformation.Options = { ...defaults, ...options }
  const attrs: any = cl.imageTag(parameters.src, all).attributes()
  node.src = attrs.src
}
