//jest test
import App from '../../App';
import { transform } from '../../types';
import { combineTransform } from '../../util/CombineTransform';

test('combineTransform works', () => {
    let array: transform =       [1, 2, 3, 4 , 5 , 6 , 7 , 8 , 9 , 10, 11, 12, 13, 14, 15, 16 ];
    let secondArray: transform = [5, 3, 5, 10, 5 , 3 , 5 , 10, 5 , 3 , 5 , 10, 5 , 3 , 5 , 10];
    let resultArray: transform = [6, 5, 8, 14, 10, 9 , 12, 18, 14, 13, 16, 22, 18, 17, 20, 26];
    let result = combineTransform(array, secondArray);
    result.forEach((e: number, i: number) => {
        expect(e).toBe(resultArray[i]);
    });

});