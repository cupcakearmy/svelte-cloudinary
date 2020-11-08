# svelte-cloudinary

This is a little library that aims at integrating and making it easier to use the svelte with [Cloudinary](https://cloudinary.com/).
There is an official integration comming, but it's not ready and for not does not work great.

## 🚀 Quickstart

```bash
yarn add svelte-cloudinary
```

```svelte
<script>

  import { image } from 'svelte-cloudinary'

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
  use:image={{ src, bind: true, options: { crop: 'fill' } }}
  class="home-img"
  alt="background" />
```

This will formulate the Cloudinary url and insert it into the `img.src` property.
Also it will resize to the `img` object itself because we set `bind: true`.

## 🗂 Docs

The `image` action takes 3 parameters.

### `src`

The `publicId` of your asset.

### `bind`

This is a utility for setting width and/or height automatically based on the size of a rendered element in the DOM.

- `true`: Uses the size of the img node itself
- `'.someClass'`: Searches for the element closest to the image that matches the css query and takes that as size
- `{ height: document.querySelector('#some'), height: '#some' }`: Set height and/or width independently from another. Can be an element or css selector.

###### Examples

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
