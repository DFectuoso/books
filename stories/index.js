import { configure } from '@storybook/react'

import '../admin/frontend/styles/index.scss'

const req = require.context('./../stories/components', true, /\.stories\.js$/)

function loadStories () {
  req.keys().forEach((filename) => req(filename))
}

configure(loadStories, module)
