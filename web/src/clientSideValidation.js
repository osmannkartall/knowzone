export function validateDescription(
  description,
  setDescriptionCheck,
  max = undefined,
  min = undefined,
) {
  let isInvalid = true;
  let text = '';

  if (max !== undefined && description.length > max) {
    text = `Description cannot exceed ${max} characters.`;
  } else if (min !== undefined && description.length < min) {
    text = 'Please fill in the description section.';
  } else {
    isInvalid = false;
  }
  setDescriptionCheck({ text, isInvalid });
  return !isInvalid;
}

export function validateError(error, setErrorCheck, max = undefined, min = undefined) {
  let isInvalid = true;
  let text = '';

  if (max !== undefined && error.length > max) {
    text = `Error cannot exceed ${max} characters.`;
  } else if (min !== undefined && error.length < min) {
    text = 'Please fill in the error section.';
  } else {
    isInvalid = false;
  }
  setErrorCheck({ text, isInvalid });
  return !isInvalid;
}

export function validateSolution(solution, setSolutionCheck, max = undefined, min = undefined) {
  let isInvalid = true;
  let text = '';

  if (max !== undefined && solution.length > max) {
    text = `Solution cannot exceed ${max} characters.`;
  } else if (min !== undefined && solution.length < min) {
    text = 'Please fill in the solution section.';
  } else {
    isInvalid = false;
  }
  setSolutionCheck({ text, isInvalid });
  return !isInvalid;
}

export function validateLinks(links, setLinksCheck, max = undefined, min = undefined) {
  let isInvalid = true;
  let text = '';

  if (max !== undefined && links.length > max) {
    text = `Number of links cannot exceed ${max}.`;
  } else if (min !== undefined && links.length < min) {
    text = 'Please fill in the links section.';
  } else {
    isInvalid = false;
  }
  setLinksCheck({ text, isInvalid });
  return !isInvalid;
}

export function validateTopics(
  topics,
  setTopicsCheck,
  max = undefined,
  min = undefined,
  pattern = undefined,
) {
  let isInvalid = true;
  let text = '';

  if (min !== undefined && topics.length < min) {
    text = `At least ${min} topic should be defined.`;
  } else if (max !== undefined && topics.length > max) {
    text = `Number of topics cannot exceed ${max}.`;
  } else if (pattern !== undefined && topics.length > 0) {
    const matchedTopics = topics.map((tag) => tag.match(pattern));
    isInvalid = matchedTopics.includes(null);
    if (isInvalid) {
      text = 'Invalid topic(s). A topic should be at most 30 alphanumeric characters and it may also contain hyphen.';
    }
  } else {
    isInvalid = false;
  }
  setTopicsCheck({ text, isInvalid });
  return !isInvalid;
}
