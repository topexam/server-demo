export class GetReviewItemQuery {
  constructor(
    public readonly reviewId: string,
    public readonly userId: string,
  ) {}
}
