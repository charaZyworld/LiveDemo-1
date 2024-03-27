import type { NextPage } from "next"
import Head from "next/head"

import { GalleryView } from "views/gallery"

const userGallery: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Your NFTs</title>
        <meta name="description" content="Basic Functionality" />
      </Head>
      <GalleryView />
    </div>
  )
}

export default userGallery