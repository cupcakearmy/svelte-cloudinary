# svelte-cloudinary

This is a little library that aims at integrating and making it easier to use the svelte with [Cloudinary](https://cloudinary.com/).
There is an official integration comming, but it's not ready and for not does not work great.

## 🌈 Features

- Fully typed and typescript compatible
- [Tiny: `~30kb gzip`](https://bundlephobia.com/result?p=svelte-cloudinary) (Of which 99% is the cloudinary dep.)
- Automatic **resizing** based on the DOM and applied CSS
- Automatic **lazy loading**
- Fully compatible with native cloudinary options

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

## ⌨️ Examples

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
