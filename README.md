> DEPRECATED
>
> See https://github.com/cloudinary-community/svelte-cloudinary
>
> The npm package will be transfered to them.

# svelte-cloudinary

![dependencies](https://badgen.net/david/dep/cupcakearmy/svelte-cloudinary)
![downloads badge](https://badgen.net/npm/dt/svelte-cloudinary)
![types badge](https://badgen.net/npm/types/svelte-cloudinary)
![version badge](https://badgen.net/npm/v/svelte-cloudinary)
![minzip size badge](https://badgen.net/bundlephobia/minzip/svelte-cloudinary)

This is a little library that aims at integrating and making it easier to use the svelte with [Cloudinary](https://cloudinary.com/).
There is an [official integration coming](https://github.com/cloudinary/cloudinary-svelte), but it's not ready and for not does not work great for now (SSR e.g.).

## 🌈 Features

- Fully typed and typescript compatible
- [Tiny: `~30kb gzip`](https://bundlephobia.com/result?p=svelte-cloudinary) (Of which 99% is the cloudinary dep.)
- Automatic **resizing** based on the DOM and applied CSS
- Automatic **lazy loading**
- Fully compatible with native cloudinary options
- Sapper (SSR) compatible

## 🗂 [Docs](https://svelte-cloudinary.vercel.app/modules/_index_)

## ❓ Questions & More -> [Discussions](https://github.com/cupcakearmy/svelte-cloudinary/discussions)

## 🚀 Quickstart

```bash
npm install svelte-cloudinary
```

```svelte
<script>

  import { image, initialize } from 'svelte-cloudinary'

  initialize({ cloud_name: 'myCloudinaryCloud' })

  const src = 'my/cloudinary/asset'
</script>

<style>
  img {
    width: 50vw;
    height: 50vh;
    object-fit: cover;
  }
</style>

<img
  use:image={{ src, bind: true, lazy: true }}
  class="home-img"
  alt="background" />
```

This will formulate the Cloudinary url and insert it into the `img.src` property.
Also it will resize to the `img` object itself because we set `bind: true`.

> ⚠️ In firefox if you want to use the `bind` option to automatically compute sizes you need to set `img { display: inline-block or block; }` otherwise there can be problems with `getComputedStyle`.

## ☁️ Cloudinary Setup

If you want the use super handfull auto upload function (which I think will apply to everyone) you have to set configure a few settings first.

- Settings -> Security -> Allowed fetch domains: Add your domain(s) from which the images are fetched from.
- Settings -> Upload -> Auto upload mapping: Set the mapping for your domain and/or path

###### Example

Immagine you want to serve an image with the url of: `https://api.example.org/images/elephants.png`

1. Settings -> Security -> Allowed fetch domains: Add `api.example.org` to the list.
2. Settings -> Upload -> Auto upload mapping:<br>Folder: `myimages`<br>URL prefix: `https://api.example.org/images/`

Now you can use the auto upload funtion like this:

```svelte
<img
  use:image={{ src: 'myimages/elephants.png' }}
  class="home-img"
  alt="background" />
```

## 🤔 Why an [action](https://svelte.dev/docs#use_action) and not component?

Well components are great of course, but when we only need to set a `src` tags we can leverage the upsides of a svelte [action](https://svelte.dev/docs#use_action)

What are benefits?

- Native styling (Svelte for now does not allow easy styling of child components) <br> With an action we can easily use local styling beacuse we still have access to the `<img />` element
- Lightweight
- Reusable and composable

Downsides:

- The src will not be set serverside, so also not in the initial server response. Which I believe is not that bad though for images.

## 👷 Sapper

If you are using sapper you can initialize it once in your root `_layout.svelte`.

```svelte
<script lang="ts">
	import { initialize } from 'svelte-cloudinary'

	initialize({ cloud_name: 'mycloud' })

  // ...
</script>
```

## 🤓 Key Concepts

### `lazy`

###### default `true`

If images should use the [`Intersection Observer API`](https://developer.mozilla.org/en-US/docs/Web/API/Intersection_Observer_API) to lazy load.

### `step`

###### default `200`

The `step` property helps reducing the amounts of transformations cloudinary need to perform and less credits being billed to you.

How? Basically whenever we calculate the dynamic size of the image rendered on the DOM we will get very specific numbers depending on the device.

With `step` we approximate the size needed to the nearset bigger multiple of `step`.

###### Example

Imagine the same `<img />` has the width of `420`,`470` and `1080` on an iPhone, Android and Laptop respectively.

With a `step` size of e.g. `100` (`<img use:image={{ ..., step: 100 }} />`) they will become `500`, `500`, and `1100`. This will limit the ammount of transformations needed.

### `bind`

With bind we can dynamically set the width and/or height of the transformed image depending of the rendered size.

- `bind: this` The size of the `<img />` element
- `bind: el` The computed size of another element in the dom (useful for a carousel e.g.)
- `bind: { width: this }` Only bind the width, leaving the height free. Also works with height of course
- `bind: { width: '.wrapper' }` Finds the closest element that matches the selector and uses it for width.

##### Note

If you provide a `bind` options (`<img use:image={{..., bind: true }} />`) but no crop option, we will automatically add `crop: 'fill'` otherwise the image will not be resized by cloudinary.

###### TLDR;

```svelte
<img use:image={{ src, bind: true }} />
<!-- Is internally equivalent to the following -->
<img use:image={{ src, bind: true, options: { crop: 'fill' } }} />
```

## ⌨️ Examples

### Fixed size

```svelte
<img
  use:image={{ src, options: { width: 200, height: 100, crop: 'fill' } }}
/>
```

### `bind`

```svelte
<!-- Simple -->
<img
  use:image={{ src, bind: true, }}
/>
```

```svelte
<!-- Bind size to parent with selectors -->
<div class="wrapper"
  <img
    use:image={{ src, bind: '.wrapper', }}
  />
</div>
```

```svelte
<!-- Bind width to parent with element -->
<div class="wrapper"
  <img
    use:image={{ src, bind: { width: '.wrapper' }, }}
  />
</div>
```

### `options`

Native cloudinary options. See [here for official docs](https://cloudinary.com/documentation/image_transformations)
For a quick glance
