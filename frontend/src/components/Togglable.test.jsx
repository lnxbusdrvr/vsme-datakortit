
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import Togglable from './Togglable'

describe('<Togglable />', () => {
  beforeEach(() => {
    render(
      <Togglable buttonLabel="show component">
        <div>togglable component data</div>
      </Togglable>
    )
  })

  test('renders its children', () => {
    screen.getByText('togglable component data')
  })

  test('at start the children component isnt displayed', () => {
    const element = screen.getByText('togglable component data')
    expect(element).not.toBeVisible()
  })

  test('after click, children component is displayed', async () => {
    const user = userEvent.setup()
    const button = screen.getByText('show component')
    await user.click(button)

    const element = screen.getByText('togglable component data')
    expect(element).toBeVisible()
  })

  test('toggled data can be closed', async () => {
    const user = userEvent.setup()

    const button = screen.getByText('show component')
    await user.click(button)

    const closeButton = screen.getByText('peruuta')
    await user.click(closeButton)

    const element = screen.getByText('togglable component data')
    expect(element).not.toBeVisible()
  })
})
