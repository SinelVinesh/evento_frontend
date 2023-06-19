export enum FieldType {
  text = 'text',
  number = 'number',
  email = 'email',
  password = 'password',
  date = 'date',
  time = 'time',
  datetime = 'datetime-local',
  month = 'month',
  week = 'week',
  textArea = 'textArea',
  select = 'select',
  disabled = 'disabled',
  imageGallery = 'image-gallery',
  numberInterval = 'number-interval',
  multiple = 'multiple',
}

export enum ValidationType {
  required,
  dateInterval,
  regex,
  min,
  dateAfter,
  max,
}

export enum SheetSectionType {
  text,
  image,
  images,
  table,
  component,
}
