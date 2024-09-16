import TabContainer from './TabContainer';

export default function SupportTab() {
  return (
    <TabContainer>
      <div className="p-6">
        <div className="max-w-lg prose mx-auto">
          <h1 className="text-3xl font-semibold">General Feedback</h1>
          <p>Submit general feedback thoughts, and ideas about AgentWP.</p>
          <p>
            For feedback on specific messages please don’t use this - instead rank the message and
            use the resulting UI for more detailed feedback.
          </p>
          <p>This is not a support channel. For account support, click here.</p>
        </div>
      </div>
    </TabContainer>
  );
}
