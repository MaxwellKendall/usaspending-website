import {
    addSearchResultsToTree,
    getHighestAncestorNaicsCode,
    getImmediateAncestorNaicsCode,
    getNodeFromTree,
    expandAllNodes,
    showAllTreeItems
} from 'helpers/checkboxTreeHelper';
import * as mockData from '../containers/search/filters/naics/mockNaics_v2';

// overwriting this because it makes life easier
const mockSearchResults = [{
    ...mockData.searchResults[0],
    children: [{
        ...mockData.searchResults[0].children[0],
        children: [{
            value: 'pretend',
            naics: 'pretend',
            description: 'this is not real, but pretend',
            count: 0
        }]
    }]
}];

describe('checkboxTree Helpers', () => {
    describe('mergeChildren & addSearchResultsToTree', () => {
        it('does NOT overwrite existing grand-children', () => {
            const existingNodes = mockData.treeWithPlaceholdersAndRealData;
            const [newChildren] = addSearchResultsToTree(existingNodes, mockSearchResults);
            const grandChildrenWithSearch = newChildren.children[0].children;
            const existingGrandChildren = existingNodes[0].children[0].children;
            expect(grandChildrenWithSearch.length).toEqual(existingGrandChildren.length + 1);
        });
    });
    describe('expandAllNodes', () => {
        it('returns an array containing all values from tree', () => {
            const result = expandAllNodes(mockData.searchResults);
            // does not expand grand children as they have no children.
            expect(result).toEqual(["11", "1111"]);
        });
    });
    describe('getNodeFromTree', () => {
        it('grabs the correct node from the tree at every level', () => {
            // parent
            const parent = getNodeFromTree(mockData.reallyBigTree, '21', 'naics');
            expect(parent.naics_description).toEqual("Mining, Quarrying, and Oil and Gas Extraction");
            // child
            const child = getNodeFromTree(mockData.reallyBigTree, '1113', 'naics');
            expect(child.naics_description).toEqual("Fruit and Tree Nut Farming");

            // grandchild
            const granchild = getNodeFromTree(mockData.reallyBigTree, '115310', 'naics');
            expect(granchild.naics_description).toEqual("Support Activities for Forestry");
        });
    });
    describe('getHighestAncestorNaicsCode', () => {
        const result = getHighestAncestorNaicsCode('111111');
        expect(result).toEqual('11');
    });
    describe('getImmediateAncestorNaicsCode', () => {
        const result = getImmediateAncestorNaicsCode('111111');
        expect(result).toEqual('1111');
    });
    describe('showAllTreeItems', () => {
        it('removes the hide class from all nodes', () => {
            const result = showAllTreeItems(mockData.reallyBigTree);
            const nodeWithHideClass = getNodeFromTree(result, '115310', 'naics');
            expect(nodeWithHideClass.className).toEqual('');
        });
        it('adds new children and removes the loading placeholder if we have all the nodes', () => {
            const result = showAllTreeItems(mockData.placeholderNodes, '11', [mockData.reallyBigTree[0]]);
            const lengthWithoutPlaceholderNodes = mockData.reallyBigTree[0].children.length;
            const nodeWithPlaceHolderChildren = getNodeFromTree(result, '11', 'naics');
            expect(nodeWithPlaceHolderChildren.children.length).toEqual(lengthWithoutPlaceholderNodes);
        });
    });
});
