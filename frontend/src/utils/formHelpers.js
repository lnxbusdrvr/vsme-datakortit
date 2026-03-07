
export const getMoreQuestionIdIfCtrlQsYes = (questionId) => {
  if (!questionId || !questionId.includes('_if_this_q_yes_'))
    return null

  return `if_prev_yes_${questionId}`
}

export const validateNumber = (e, fieldId, fieldError, setFieldError) => {
  const allowedKeys = ['Backspace', 'Delete', 'Tab', 'Escape',
    'Enter', 'ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown']

  if (allowedKeys.includes(e.key) || e.ctrlKey || e.metaKey)
    return

  if (!/^[0-9]$/.test(e.key)) {
    e.preventDefault()
    setFieldError({...fieldError, [fieldId]: 'Vain numerot ovat sallittuja'})
    setTimeout(() => setFieldError({...fieldError, [fieldId]: null}), 3000)
  }
}
