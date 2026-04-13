import { render, screen, waitFor, within } from '@testing-library/react'
import { describe, expect, it, vi} from 'vitest'
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
  default: { getAll: () => Promise.resolve([
    {
      module: 'Perusmoduuli',
      module_id: 'basic_module',
      sections: [
        {
          section_id: 'q1',
          title: 'Legacy of zeros and ones',
          questions: [
            {
              id: 'q1_ada_lovelace',
              question: 'First',
              type: 'text'
            }
          ]
        }
      ]
    },
    {
      module: 'Perusmoduuli',
      module_id: 'basic_module',
      sections: [
        {
          section_id: 'q2',
          title: "Trucks",
          questions: [
            {
              id: 'q2_trucks',
              type: 'group',
              sub_questions: [
                {
                  id: 'q2_trucks_lorrys_lkws',
                  category: 'What scandinavian truck',
                  fields: [
                    {
                      id: 'q2_trucks_lorrys_lkws_scania',
                      label: 'R',
                      type: 'text'
                    },
                    {
                      id: 'q2_trucks_lorrys_lkws_volvo',
                      label: 'F16',
                      type: 'text'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    },
    {
      module: 'Perusmoduuli',
      module_id: 'basic_module',
      sections: [
        {
          section_id: 'q3',
          title: 'Would you like to hear',
          questions: [
            {
              id: 'q3_if_this_q_yes_describe_more',
              question: 'Jack\'s or Nr. One\'s questions?',
              type: 'boolean'
            }
          ]
        }
      ]
    },
    {
      module: 'Perusmoduuli',
      module_id: 'basic_module',
      sections: [
        {
          section_id: 'q3',
          title: "Babylon Prisoner Nr. One",
          questions: [
            {
              id: 'if_prev_yes_q3_if_this_q_yes_describe_more',
              type: 'group',
              sub_questions: [
                {
                  id: 'sub_q_if_prev_yes_q3_if_this_q_yes_describe_more',
                  category: 'Questions from Jack',
                  fields: [
                    {
                      id: 'q3_who_are_you',
                      label: 'Who are you?',
                      type: 'text'
                    },
                    {
                      id: 'q3_what_you_want',
                      label: 'What you want?',
                      type: 'text'
                    }
                  ]
                }
              ]
            }
          ]
        }
      ]
    }
  ])
  }
}))

vi.mock('../services/comprehensiveService', () => ({
  default: { getAll: () => Promise.resolve([]) }
}))

const mocks = vi.hoisted(() => {
  return {
    currentMockAnswers: [],
    getAll: vi.fn(),
    deleteAnswer: vi.fn(),
    updateAnswer: vi.fn()
  }
})

mocks.getAll.mockImplementation(() => Promise.resolve(mocks.currentMockAnswers))
mocks.deleteAnswer.mockImplementation((id) => {
  mocks.currentMockAnswers = mocks.currentMockAnswers.filter(a => a.id !== id)
  return Promise.resolve({})
})
mocks.updateAnswer.mockImplementation((id, data) => {
  const index = mocks.currentMockAnswers
    .findIndex(a => a.id === id)
  if (index !== -1) {

    const updatedObject = {
      ...mocks.currentMockAnswers[index],
      ...data
    }

    const hasAnswers = updatedObject.groupAnswers &&
                       updatedObject.groupAnswers.length > 0 &&
                       Object.keys(updatedObject.groupAnswers[0].values || {}).length > 0

    // Delete if groupAnswer is empty
    if (!hasAnswers && updatedObject.type === 'group') {
      mocks.currentMockAnswers = mocks.currentMockAnswers.filter(a => a.id !== id)
      return Promise.resolve({})
    }

    if (updatedObject.groupAnswers && updatedObject.groupAnswers.length === 0) {
      mocks.currentMockAnswers = mocks.currentMockAnswers.filter(a => a.id !== id)
      return Promise.resolve({})
    }

    // Otherwise delete throught update 
    const newAnswers = [...mocks.currentMockAnswers]
    newAnswers[index] = updatedObject
    mocks.currentMockAnswers = newAnswers

    return Promise.resolve(updatedObject)
  }
  return Promise.resolve(null)
})

vi.mock('../services/answersService', () => ({
  default: {
    getAll: mocks.getAll,
    deleteAnswer: mocks.deleteAnswer,
    updateAnswer: mocks.updateAnswer
  }
}))

describe('Answers component', () => {

  const user = userEvent.setup()
  const mockHandler = vi.fn()

  afterEach(() => {
    vi.clearAllMocks()
  })

  it('Should delete normal answer', async () => {

    // Preperation
    const mockAnswer = {
      id: 'answer-01',
      moduleId: 'basic_module',
      sectionsId: 'q1',
      questionId: 'q1_ada_lovelace',
      type: 'text',
      answer: 'Ada Lovelace computer',
      user: { id: MOCK_ID }
    }

    // Run answers dynamically throught vi.mock
    mocks.currentMockAnswers = [mockAnswer]

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

    // Now find the actual words
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

    const finalMessage = screen.getByText(/Käyttäjä ei ole vastaunnut yhteenkään kysymykseen/i)
    expect(finalMessage).toBeInTheDocument()
  })

  it('Should delete subQuestion answer', async () => {
    const mockSubQuestionAnswer = {
      id: 'answer-02',
      moduleId: 'basic_module',
      sectionsId: 'q2',
      questionId: 'q2_trucks',
      type: 'group',
      groupAnswers: [{
        subQuestionId: 'q2_trucks_lorrys_lkws',
        values: {
          'q2_trucks_lorrys_lkws_scania': {
            value: 'Scania',
            fieldType: 'text'
          },
          'q2_trucks_lorrys_lkws_volvo': {
            value: 'Volvo',
            fieldType: 'text'
          }
        }
      }],
      user: { id: MOCK_ID }
    }

    mocks.currentMockAnswers = [mockSubQuestionAnswer]
    const isConfirmButtonTrue = vi
      .spyOn(window, 'confirm').mockReturnValue(true)

    const preloadedState = {
      answers: [mockSubQuestionAnswer]
    }

    renderWithProviders(<Answers />, {
      preloadedState,
      route: `/useranswers/${MOCK_ID}`,
      path: '/useranswers/:id'
    })

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    const scaniaText = await screen.findByText(/Scania/i)
    expect(scaniaText).toBeInTheDocument()
    const volvoText = await screen.findByText(/Volvo/i)
    expect(volvoText).toBeInTheDocument()

    // Get ScaniaText closest div in DOM
    const scaniaContainer = scaniaText.closest('div')

    // Find scania-delete-button
    const scaniaDeleteButton = within(scaniaContainer).getByRole('button', { name: /Poista vastaus/i })

    await user.click(scaniaDeleteButton)

    expect(isConfirmButtonTrue).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.queryByText(/Scania/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    // Clear spy
    isConfirmButtonTrue.mockClear()

    // Ask again, because page in re-rended
    const updatedVolvoText = await screen.findByText(/Volvo/i)

    const volvoContainer = updatedVolvoText.closest('div')
    const volvoDeleteButton = within(volvoContainer).getByRole('button', { name: /Poista vastaus/i })

    await user.click(volvoDeleteButton)

    expect(isConfirmButtonTrue).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.queryByText(/Volvo/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    const finalMessage = screen.getByText(/Käyttäjä ei ole vastaunnut yhteenkään kysymykseen/i)
    expect(finalMessage).toBeInTheDocument()
  })

  it('Delete if yes show more answer with it\'s supplement-answers', async () => {
    const isConfirmButtonTrue = vi
      .spyOn(window, 'confirm').mockReturnValue(true)

    const mockIfYesShowMoreAnswer = [{
      id: 'answer-03_if_this_qs_is_yes_show_more_qs',
      moduleId: 'basic_module',
      sectionsId: 'q3',
      questionId: 'q3_if_this_q_yes_describe_more',
      type: 'boolean',
      answer: true,
      user: { id: MOCK_ID }
    },
    {
      id: 'answer-04-show_more_questions_when_prev_was_yes',
      moduleId: 'basic_module',
      sectionsId: 'q3',
      questionId: 'if_prev_yes_q3_if_this_q_yes_describe_more',
      type: 'group',
      groupAnswers: [{
        subQuestionId: 'sub_q_if_prev_yes_q3_if_this_q_yes_describe_more',
        values: {
          'q3_who_are_you': {
            value: 'John',
            fieldType: 'text'
          },
          'q3_what_you_want': {
            value: 'I want information',
            fieldType: 'text'
          }
        }
      }],
      user: { id: MOCK_ID }
    }]

    mocks.currentMockAnswers = mockIfYesShowMoreAnswer

    const preloadedState = {
      answers: [mockIfYesShowMoreAnswer]
    }

    renderWithProviders(<Answers />, {
      preloadedState,
      route: `/useranswers/${MOCK_ID}`,
      path: '/useranswers/:id'
    })

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    const yesText = await screen.findByText(/Kyllä/i)
    expect(yesText).toBeInTheDocument()

    const johnText = await screen.findByText(/John/i)
    expect(johnText).toBeInTheDocument()
    const informationText = await screen.findByText(/I want information/i)
    expect(johnText).toBeInTheDocument()

    const yesContainer = yesText.closest('div')
    const yesDeleteButton = within(yesContainer).getByRole('button', { name: /Poista vastaus/i })

    await user.click(yesDeleteButton)

    expect(isConfirmButtonTrue).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.queryByText(/Kyllä/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    const finalMessage = screen.getByText(/Käyttäjä ei ole vastaunnut yhteenkään kysymykseen/i)
    expect(finalMessage).toBeInTheDocument()
  })

  it('if yes show more answer can be deleted if suppliment answers were deleted first', async () => {
    const isConfirmButtonTrue = vi
      .spyOn(window, 'confirm').mockReturnValue(true)

    const mockIfYesShowMoreAnswer = [{
      id: 'answer-03_if_this_qs_is_yes_show_more_qs',
      moduleId: 'basic_module',
      sectionsId: 'q3',
      questionId: 'q3_if_this_q_yes_describe_more',
      type: 'boolean',
      answer: true,
      user: { id: MOCK_ID }
    },
    {
      id: 'answer-04-show_more_questions_when_prev_was_yes',
      moduleId: 'basic_module',
      sectionsId: 'q3',
      questionId: 'if_prev_yes_q3_if_this_q_yes_describe_more',
      type: 'group',
      groupAnswers: [{
        subQuestionId: 'sub_q_if_prev_yes_q3_if_this_q_yes_describe_more',
        values: {
          'q3_who_are_you': {
            value: 'John',
            fieldType: 'text'
          },
          'q3_what_you_want': {
            value: 'I want information',
            fieldType: 'text'
          }
        }
      }],
      user: { id: MOCK_ID }
    }]

    mocks.currentMockAnswers = mockIfYesShowMoreAnswer

    const preloadedState = {
      answers: [mockIfYesShowMoreAnswer]
    }

    renderWithProviders(<Answers />, {
      preloadedState,
      route: `/useranswers/${MOCK_ID}`,
      path: '/useranswers/:id'
    })

    await waitFor(() => {
      expect(screen.queryByText(/Loading/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    const informationText = await screen.findByText(/I want information/i)
    expect(informationText).toBeInTheDocument()
    const johnText = await screen.findByText(/John/i)
    expect(johnText).toBeInTheDocument()

    const yesText = await screen.findByText(/Kyllä/i)
    expect(yesText).toBeInTheDocument()

    const informationTextContainer = informationText.closest('div')
    const informationTextDeleteButton = within(informationTextContainer)
      .getByRole('button', { name: /Poista vastaus/i })

    await user.click(informationTextDeleteButton)
    expect(isConfirmButtonTrue).toHaveBeenCalledTimes(1)

    await waitFor(() => {
      expect(screen.queryByText(/I want information/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    const updatedJohnText = await screen.findByText(/John/i)

    const johnTextContainer = updatedJohnText.closest('div')
    const johnTextDeleteButton = within(johnTextContainer).getByRole('button', { name: /Poista vastaus/i })

    await user.click(johnTextDeleteButton)

    expect(isConfirmButtonTrue).toHaveBeenCalledTimes(2)

    await waitFor(() => {
      expect(screen.queryByText(/John/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    const updatedYesText = await screen.findByText(/Kyllä/i)

    const yesTextContainer = updatedYesText.closest('div')
    const yesTextDeleteButton = within(yesTextContainer).getByRole('button', { name: /Poista vastaus/i })

    await user.click(yesTextDeleteButton)

    expect(isConfirmButtonTrue).toHaveBeenCalledTimes(3)

    await waitFor(() => {
      expect(screen.queryByText(/Kyllä/i))
        .not
        .toBeInTheDocument()
    }, { timeout: 3000 })

    const finalMessage = screen.getByText(/Käyttäjä ei ole vastaunnut yhteenkään kysymykseen/i)
    expect(finalMessage).toBeInTheDocument()
  })

})

