export const volunteerText = {
  ids: [process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEEREXEMPT, process.env.NEXT_PUBLIC_FORM_TYPES_VOLUNTEER],
  text: 'A "Volunteer" clearance is required if you will be attending schools for unpaid work.',
  wwccItems: [
    'Volunteering to attend a camp and stay overnight',
    'Will be providing personal care to a child with a disability',
    'Volunteering as part of a formal mentoring program (i.e Duke of Edinburgh)',
    'Any other unpaid work that involves contact with children or sensitive information about children'
  ],
}

export const contractorText = {
  ids: [process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOREXEMPT, process.env.NEXT_PUBLIC_FORM_TYPES_CONTRACTOR],
  text: 'A "Contractor" clearance is required if you will be attending schools for paid work.',
  wwccItems: [
    'Providing cleaning services at a school',
    'Visiting as a children\'s entertainer (e.g. magician, carnival, musician)',
    'Working as a transport services provider',
    'Any other paid work that involves contact with children or sensitive information about children'
  ]
}