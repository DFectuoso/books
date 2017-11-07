import React from 'react'

import { storiesOf } from '@storybook/react'
import Loader from './../../../lib/frontend/components/spinner'

storiesOf('Loader', module)
  .add('Simple loader', () => <Loader />)
