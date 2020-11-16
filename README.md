# svelte-cloudinary

This is a little library that aims at integrating and making it easier to use the svelte with [Cloudinary](https://cloudinary.com/).
There is an official integration coming, but it's not ready and for not does not work great for now (SSR e.g.).

## 🌈 Features

- Fully typed and typescript compatible
- [Tiny: `~30kb gzip`](https://bundlephobia.com/result?p=svelte-cloudinary) (Of which 99% is the cloudinary dep.)
- Automatic **resizing** based on the DOM and applied CSS
- Automatic **lazy loading**
- Fully compatible with native cloudinary options
- Sapper (SSR) compatible

## 🗂 [Docs](https://svelte-cloudinary.vercel.app/modules/_index_)

## 🚀 Quickstart

```bash
yarn add svelte-cloudinary
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

## 🤔 Why an [action](https://svelte.dev/docs#use_action) and not component?

Well components are great of course, but when we only need to set a `src` tags we can leverage the upsides of a svelte [action](https://svelte.dev/docs#use_action)

What are benefits?

- Native styling (Svelte for now does not allow easy styling of child components) <br> With an action we can easily use local styling beacuse we still have access to the `<img />` element
- Lightweight
- Reusable and composable

Downsides:

- The src will not be set serverside, so also not in the initial server response. Which I believe is not that bad though for images.

## 🤓 Key Concepts

### `step`

The `step` property (defaults to `200`) helps reducing the amounts of transformations cloudinary need to perform and less credits being billed to you.

How? Basically whenever we calculate the dynamic size of the image rendered on the DOM we will get very specific numbers depending on the device.

With `step` we approximate the size needed to a multiple of `step`.

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
