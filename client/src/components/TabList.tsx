import { TabListProps } from '../../../types';
import TabItem from './TabItem';
// @ts-ignore
import './TabList.css';

export default function TabList({ tabs }: TabListProps) {

  // todo done: moved format function to TabItem component to be able to pass a type Visit to it
  // todo done: removed unnec. parentheses around statements, argument and returned element

  return (
    <div id='container'>
      {tabs.length > 0
        ?
          tabs.map( tab =>
            <TabItem key={tab.id} site={tab.site} timeSpent={tab.timeSpent} />
          )
        :
          <p>No tracked data available.</p>
      }
    </div>
  );
}