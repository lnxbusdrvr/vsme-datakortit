/*
 * This file is partially helped to refactor by Augment AI
 */
import PasswordCheckList from 'react-password-checklist'

/*
 * This function is partially AI Generated
 */
export const getMoreQuestionIdIfCtrlQsYes = (questionId) => {
  if (!questionId || !questionId.includes('_if_this_q_yes_'))
    return null

  return `if_prev_yes_${questionId}`
}

/*
 * This function is partially AI Generated
 */
export const validateNumber = (e, fieldId, fieldError, setFieldError) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape',
    'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey)
    return

  // Allow only numbers
  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault()
    setFieldError({ ...fieldError, [fieldId]: 'Vain numerot ovat sallittuja' })
    setTimeout(() => setFieldError({ ...fieldError, [fieldId]: null }), 3000)
  }
}

// Not-AI generated
export const passwordCheckListRules = (password, passwordConfirm) => {
  /* eslint-disable no-unused-vars */
  return (
    <PasswordCheckList
      rules={['minLength','specialChar','number','capital','match']}
      minLength={8}
      value={password}
      valueAgain={passwordConfirm}
      onChange={(isValid) => {}}
      messages={{
        minLength: 'Salasanassa on vähintään 8 merkkiä.',
        specialChar: 'Salasanassa on erikoismerkki.',
        number: 'Salasanassa on numero.',
        capital: 'Salasanassa on iso kirjain.',
        match: 'Salasanat täsmäävät.'
      }}
    />
  )
}
