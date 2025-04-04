import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'subscribersDateFilter'
})
export class SubscribersDateFilterPipe implements PipeTransform {
  transform(memberList: any[], dateLimit: string, condition: 'before' | 'after' = 'before'): any[] {
    if (!memberList || !dateLimit) return memberList;

    return memberList.filter(member => {
      const memberDate = new Date(member.date_created);
      const limitDate = new Date(dateLimit);

      return condition === 'before' ? memberDate < limitDate : memberDate > limitDate;
    });
  }
}
