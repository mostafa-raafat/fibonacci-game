import React, { Component } from 'react'
import './game.style.scss';

type gridSize = {
    rows: number,
    cols: number
}

type stateType = {
    gameGrid: any[][],
    selectedCell: {
        row: number | undefined,
        column: number | undefined
    },
    fibSequence: any
}

export default class GameComponent extends Component<gridSize, stateType> {

    private gameGrid: any[][] = [];
    private fibSequence: any = {};
    private fibListCache: any = {};
    private fibNumbersCache: any = {};
    private timerHandle: NodeJS.Timeout | undefined;
    
    constructor(props: any) {
        super(props);
        for (let i = 0; i < this.props.rows; i++) {
            this.gameGrid[i] = new Array(this.props.cols).fill(null);
        }
        this.state = {
            gameGrid: this.gameGrid,
            selectedCell: {
                row: undefined,
                column: undefined
            },
            fibSequence: {}
        }
    }

    render() {
        return (
            <div className='grid'>
            {
                this.state.gameGrid.map((gameRow: any, rowIndex: any) => (
                    <div key={rowIndex} className="grid__row">
                    {
                        gameRow.map((gameCell: any, columnIndex: any) => (
                            <div 
                                key={rowIndex+'-'+columnIndex}
                                className={`grid__cell 
                                    ${
                                        this.state.selectedCell.row === rowIndex || 
                                        this.state.selectedCell.column === columnIndex ? 
                                        'cell-highlight' : ''
                                    }
                                    ${
                                        `${rowIndex}-${columnIndex}` in this.state.fibSequence ?
                                        'cell-highlight-green' : ''
                                    }`
                                }
                                onClick={this.cellClicked.bind(this, rowIndex, columnIndex)}
                            >
                                { gameCell ? gameCell : '' }
                            </div>
                        ))      
                    }
                    </div>
                ))
            }
            </div>
        )
    };

    /**
     * Handle click on cell.
     * Cell row & column will be increase by +1 & it will light up yellow.
     * If a fibonacci sequence is found in a row it will light up green & reset to empty.
     * @param {number} row
     * @param {number} column
     */
    public cellClicked(row: number, column: number): void {
        for (let i = 0; i < this.props.rows; i++) {
            this.gameGrid[i][column]++;
        }

        this.gameGrid[row][column]--;

        for (let i = 0; i < this.props.cols; i++) {
            this.gameGrid[row][i]++;
            this.checkFibonacci(this.gameGrid[i], i);
        }

        this.setState({gameGrid: this.gameGrid, selectedCell: { row, column }, fibSequence: this.fibSequence });
        
        // Reset state after every click.
        this.timerHandle = setTimeout(() => {
            if(Object.keys(this.fibSequence).length > 0)
                this.fibSequence = {};
            this.setState({ selectedCell: { row: undefined, column: undefined}, fibSequence: {} });
        }, 500);
    }

    /**
     * Check Fibonacci numbers in grid.
     * @param {Array<number>} row
     * @param {number} rowNumber
     */
    private checkFibonacci(row: Array<number>, rowNumber: number): void {
        for (let i = 0; i < row.length; i++) {
            if((row[i] && row[i+1] && row[i+2] && row[i+3] && row[i+4]) !== null && 
            (row[i] && row[i+1] && row[i+2] && row[i+3] && row[i+4]) > 0) {
                if(
                    this.FibValueMemo(row[i]) && this.FibValueMemo(row[i+1]) && 
                    this.FibValueMemo(row[i+2]) && this.FibValueMemo(row[i+3]) &&
                    this.FibValueMemo(row[i+4])
                ) 
                {
                    if(this.FibListMemo([row[i], row[i+1], row[i+2], row[i+3], row[i+4]]))
                        this.resetFibList(rowNumber, i);
                }
            }
        }
    }

    /**
     * reset fibonacci list.
     * @param {number} value
     */
    private resetFibList(row: number, column: number): void {
        this.gameGrid[row][column]   = 
        this.gameGrid[row][column+1] = 
        this.gameGrid[row][column+2] = 
        this.gameGrid[row][column+3] =
        this.gameGrid[row][column+4] = null;

        this.fibSequence[`${row}-${column}`] =
        this.fibSequence[`${row}-${column+1}`] =
        this.fibSequence[`${row}-${column+2}`] =
        this.fibSequence[`${row}-${column+3}`] =
        this.fibSequence[`${row}-${column+4}`] = true;
    }

    /**
     * Check if number is fibonacci.
     * @param {number} value
     * @returns {boolean}
     */
    private isFib(value: number): boolean {
        var check1 = 5 * Math.pow(value, 2) + 4;
        var check2 = 5 * Math.pow(value, 2) - 4;

        function isPerfectSquare(num: number) {
            return Math.sqrt(num) % 1 === 0;
        }

        // We see if the checks are perfect squares
        var isPerfect1 = isPerfectSquare(check1);
        var isPerfect2 = isPerfectSquare(check2);

        if (isPerfect1 && isPerfect2) {
            return true;
        }
        else return !!(isPerfect1 || isPerfect2);
    }

    /**
     * Check if list is part of fibonacci sequence.
     * @param {number[]} list
     * @returns {boolean}
     */
    private isFibSequence(list: number[]): boolean {
        if (list.length < 3) {
            return false;
        }

        let fib1 = 0;
        let fib2 = 1;

        while (fib1 < list[0]) {
            let tmp = fib1 + fib2;
            fib1 = fib2;
            fib2 = tmp;
        }

        if (fib1 !== list[0]) {
            return false;
        }

        if (fib2 !== list[1]) {
            return false;
        }

        for (let i = 2; i < list.length; i++){
            if (list[i] < 0)
                return false;

            if (list[i] !== (list[i - 1] + list[i - 2]))
                return false;
        }
        return true;
    }

    /**
     * Memorize fibonacci values.
     * @param {number} value
     * @returns {boolean}
     */
    private FibValueMemo(value: number): boolean {
        let isFib: boolean;
        let FibKey: string = value.toString();
        if (FibKey in this.fibNumbersCache)
            isFib = this.fibNumbersCache[FibKey];
        else
            isFib = this.fibNumbersCache[FibKey] = this.isFib(value);
        return isFib;
    }

    /**
     * Memorize fibonacci list.
     * @param {number[]} list
     * @returns {boolean}
     */
    private FibListMemo(list: number[]): boolean {
        let isFibSequence: boolean;
        let FibListKey: string = list.toString();
        if (FibListKey in this.fibListCache)
            isFibSequence = this.fibListCache[FibListKey];
        else
            isFibSequence = this.fibListCache[FibListKey] = this.isFibSequence(list);
        return isFibSequence;
    }

    /**
     * Clear setTimeout handler if exist.
     * @memberof ReactLifeCycle
     */
    componentWillUnmount = () => {
        // Is our timer running?
        if (this.timerHandle) {
            clearTimeout(this.timerHandle);
        }  
    }
}
