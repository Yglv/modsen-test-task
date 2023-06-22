import { Meetup } from '../meetups.entity';

export interface IMeetupsByPage {
  data: Meetup[];
  totalCountOfMeetups: number;
  pageNum: any;
  last_page: number;
}
