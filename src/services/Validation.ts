import { Validator } from "../common/types";
import { ValidationType } from "../common/enums";
import { isAfter } from "date-fns";

const required = (value: any) => {
  return value !== null && value !== undefined && value !== ''
}

interface DateIntervalArgs {
  min?: Date
  max?: Date
}

const dateInterval = (value: any, args: DateIntervalArgs) => {
  const dateValue = new Date(value)
  let result = true
  if (args.min !== undefined) {
    result = isAfter(args.min, dateValue)
  }
  if (args.max !== undefined) {
    result = isAfter(args.max, dateValue)
  }
  return result
}

interface RegexArgs {
  expression: RegExp
}
export const regex = (value: any, args: RegexArgs) => {
  return args.expression.test(value)
}
//
// export const size = (field, validFeedback, invalidFeedback, min, max) => {
//   const result = { validation: null, feedback: '' }
//   if ((min == null || field.length >= min) && (max == null || field.length <= max)) {
//     result.validation = true
//     result.feedback = validFeedback
//   } else {
//     result.feedback = invalidFeedback
//     result.validation = false
//   }
//   return result
// }
//
// export const equals = (field, validFeedback, invalidFeedback, fieldToCompare) => {
//   const result = { validation: null, feedback: '' }
//   if (field === fieldToCompare) {
//     result.validation = true
//     result.feedback = validFeedback
//   } else {
//     result.feedback = invalidFeedback
//     result.validation = false
//   }
//   return result
// }

export const validate = (value: any, validators: Validator[] | undefined) => {
  if (validators === undefined) {
    return
  }
  for (const validator of validators) {
    const args = validator.args ?? {}
    switch (validator.validationType) {
      case ValidationType.required:
        if (!required(value)) {
          return validator.feedback
        }
        break
      case ValidationType.dateInterval:
        if (!dateInterval(value, args)) {
          return validator.feedback
        }
        break
      case ValidationType.regex:
        if (!regex(value, args)) {
          return validator.feedback
        }
        break
      case ValidationType.min:
        if (args.value !== null && args.value !== undefined && value < args.value) {
          return validator.feedback
        }
        break
      case ValidationType.dateAfter:
        if (!isAfter(value, args.date)) {
          return validator.feedback
        }
        break
      case ValidationType.max:
        if (args.value !== null && args.value !== undefined && value > args.value) {
          return validator.feedback
        }
    }
  }
}
