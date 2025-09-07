const formatInterval = (days: number, hours: number) => {
  if (days === 0 && hours === 0) return 'No interval selected';

  const dayText = days === 1 ? 'day' : 'days';
  const hourText = hours === 1 ? 'hour' : 'hours';

  if (days > 0 && hours > 0) {
    return `${days} ${dayText} and ${hours} ${hourText}`;
  } else if (days > 0) {
    return `${days} ${dayText}`;
  } else {
    return `${hours} ${hourText}`;
  }
};

export default formatInterval;
