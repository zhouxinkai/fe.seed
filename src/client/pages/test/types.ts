export type Topic = {
  id: number,
  title: string,
  url: string,
  content: string,
  content_rendered: string,
  replies: number,
  created: number,
  last_modified: number
};
export type TopicList = Array<Topic>;
