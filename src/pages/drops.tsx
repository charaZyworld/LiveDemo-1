import type { NextPage } from "next"
import Head from "next/head"
import { DropPageView } from "../views/drops"

const Drops: NextPage = (props) => {
  return (
    <div>
      <Head>
        <title>Drops</title>
        <meta name="description" content="Basic Functionality" />
      </Head>
      <DropPageView />
    </div>
  )
}

export default Drops