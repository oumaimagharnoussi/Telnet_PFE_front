import { PipeTransform, Pipe } from '@angular/core';

@Pipe({
    name: 'decodeHtmlString'
})
export class DecodeHtmlStringPipe implements PipeTransform {
    transform(value: string) {
        const tempElement = document.createElement('div');
        tempElement.innerHTML = value;
        return tempElement.innerText;
    }
}
