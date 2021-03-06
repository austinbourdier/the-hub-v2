exports.updateTreeWithNewPayLoad = function (id, update, tree) {
  if (tree && tree.id == id) {
    tree.items = update;
  } else {
    if(tree.items) {
      tree.items.map(function(item) {
        return exports.updateTreeWithNewPayLoad(id, update, item);
      })
    }
  }
  return tree;
}

exports.updateTreeDeleteItem = function (parentID, fileID, tree) {
  console.log('parentID, fileID')
  console.log(parentID, fileID)
  console.log('tree.id, parentID')
  console.log(tree.id, parentID)
  if (tree && tree.id == parentID) {
    tree.items.splice(tree.items.map(function(item){return item.id}).indexOf(fileID), 1);
  } else {
    if(tree && tree.items) {
      tree.items.map(function(item) {
        return exports.updateTreeDeleteItem(parentID, fileID, item);
      })
    }
  }
  return tree;
}
exports.insertItemIntoTree = function (file, parentID, tree) {
  if (tree && tree.id == parentID) {
    file.parentID = parentID;
    tree.items.push(file);
  } else {
    if(tree && tree.items) {
      tree.items.map(function(item) {
        return exports.insertItemIntoTree(file, parentID, item);
      })
    }
  }
  return tree;
}
