export function getTopicsForPartition(topics: string[]): string[] {
  let result = [];

  for(const topic of topics){
    const topicReply = `${topic}.reply`;
    result = [...result, topicReply, topic];
  }

  return result;
}
