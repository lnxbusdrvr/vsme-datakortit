import { render, screen, waitFor } from '@testing-library/react'
import { describe, expect, test, vi} from 'vitest'
import userEvent from '@testing-library/user-event'

import { renderWithProviders } from '../utils/test-utils'

import Answers from './Answers'

const MOCK_ID = 'test-user'

// Mock storageservice to return fake-token
vi.mock('../services/storageService', () => ({
  default: {
    loadUser: () => ({
      token: 'fake-token-123',
      name: 'Bill Smith',
      id: MOCK_ID
    })
  }
}))

// Mock dataservices so not actually going to net
vi.mock('../services/usersService', () => ({
  default: {
    getUserById: (id) => Promise.resolve({
      id: id,
      name: 'Bill Smith'
    })
  }
}))

vi.mock('../services/basicService', () => ({
  default: { getAll: () => Promise.resolve([]) }
}))

vi.mock('../services/comprehensiveService', () => ({
  default: { getAll: () => Promise.resolve([]) }
}))

const mockAnswer = {
  id: 'answer-01',
  moduleId: 'basic_module',
  sectionsId: 'q1',
  questionId: 'q1_ada_lovelace',
  type: 'text',
  answer: 'Ada Lovelace computer',
  user: { id: MOCK_ID }
}

vi.mock('../services/answersService', () => ({
  default: {
    getAll: () => Promise.resolve([mockAnswer]),
    remove: () => Promise.resolve({})
  }
}))

describe('Answers component', () => {

  const user = userEvent.setup()
  const mockHandler = vi.fn()

  it('Should delete normal answer', async () => {
    const isConfirmButtonTrue = vi
      .spyOn(window, 'confirm').mockReturnValue(true)

    const preloadedState = {
      answers: [mockAnswer]
    }

    renderWithProviders(<Answers />, {
      preloadedState,
      route: `/useranswers/${MOCK_ID}`,
      path: '/useranswers/:id'
    })

    // Wait to Loading-text disapper
    await waitFor(() => {
      expect(screen.queryByText(/Loading/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    // Now find the word
    const adaTextInPage = await screen.findByText(/Ada Lovelace computer/i)
    expect(adaTextInPage).toBeInTheDocument()

    const deleteButton = screen.getByText(/Poista vastaus/i)
    await user.click(deleteButton)

    expect(isConfirmButtonTrue).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.queryByText(/Ada Lovelace computer/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    expect(screen.getTextBy(/Käyttäjä ei ole vastaunnut yhteenkään kysymykseen/i))

  })
})

