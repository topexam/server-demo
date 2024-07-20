export const calculateSubmissionScore = (
  examinationOptions: string[],
  userOptions: string[],
) => {
  if (!examinationOptions.length) return 0;

  let score = 0;
  examinationOptions.forEach((item) => {
    if (userOptions.includes(item)) {
      score++;
    }
  });

  return score / examinationOptions.length;
};
