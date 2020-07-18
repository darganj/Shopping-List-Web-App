-- CS 361 ZG Queries

-- ---------------------------------------------------------------------------------------------------------
-- TEST TO ENSURE THAT THERE IS A CONNECTION BETWEEN THE FRONT AND BACKEND
-- Display all users in the database; 7/13
-- ---------------------------------------------------------------------------------------------------------

SELECT Users.userName 
FROM Users;

-- ---------------------------------------------------------------------------------------------------------
-- DISPLAY specific Shopping List 7/13
-- ---------------------------------------------------------------------------------------------------------

SELECT Users.userName, Lists.nameList, List_of_Items.quantity, Items.itemName
FROM Users 
	LEFT JOIN Lists ON Lists.userID = Users.userID 
	LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID 
	LEFT JOIN Items ON List_of_Items.itemID = Items.itemID
WHERE Users.userID=:input_userID AND Lists.listID=:input_listID;

-- ---------------------------------------------------------------------------------------------------------
-- DISPLAY Prepopulated list by categories for admin to add 7/13
-- ---------------------------------------------------------------------------------------------------------

SELECT Items.itemName, Items.price, Nutritions.*, Links.nameLink
FROM Items 
	LEFT JOIN Nutritions ON Items.nutritionID = Nutritions.nutritionID 
	LEFT JOIN Links ON Items.linkID = Links.linkID
WHERE Items.categoryID=:input_categoryID;

-- ---------------------------------------------------------------------------------------------------------
-- UPDATE Shopping List's Name 7/13
-- ---------------------------------------------------------------------------------------------------------

UPDATE Lists
SET Lists.nameList=:input_nameList
WHERE Lists.listID=:input_listID

-- ---------------------------------------------------------------------------------------------------------
-- UPDATE Item in the Shopping List 7/13
-- ---------------------------------------------------------------------------------------------------------

UPDATE List_of_Items 
SET List_of_Items.itemID=:input_itemID
WHERE listOfItems=:input_listOfItems;

-- ---------------------------------------------------------------------------------------------------------
-- UPDATE Quantity in the Shopping List 7/13
-- ---------------------------------------------------------------------------------------------------------

UPDATE List_of_Items 
SET List_of_Items.quantity=:input_quantity
WHERE listOfItems=:input_listOfItems;

-- ---------------------------------------------------------------------------------------------------------
-- UPDATE Item AND Quantity in the Shopping List 7/13
-- ---------------------------------------------------------------------------------------------------------

UPDATE List_of_Items 
SET List_of_Items.itemID=:input_itemID, List_of_Items.quantity=:input_quantity
WHERE listOfItems=:input_listOfItems;

-- ---------------------------------------------------------------------------------------------------------
-- ORDER Shopping List by ASC Category 7/17
-- ---------------------------------------------------------------------------------------------------------

SELECT Users.userName, Categories.categoryName, Lists.nameList, List_of_Items.quantity, Items.itemName
FROM Users 
	LEFT JOIN Lists ON Lists.userID = Users.userID 
	LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID 
	LEFT JOIN Items ON List_of_Items.itemID = Items.itemID
    LEFT JOIN Categories ON Items.itemID = Categories.categoryID
WHERE Users.userID=:input_userID AND Lists.listID=:input_listID
ORDER BY Categories.categoryName ASC

-- ---------------------------------------------------------------------------------------------------------
-- ORDER Shopping List by DESC Category 7/17
-- ---------------------------------------------------------------------------------------------------------

SELECT Users.userName, Categories.categoryName, Lists.nameList, List_of_Items.quantity, Items.itemName
FROM Users 
	LEFT JOIN Lists ON Lists.userID = Users.userID 
	LEFT JOIN List_of_Items ON List_of_Items.listID = Lists.listID 
	LEFT JOIN Items ON List_of_Items.itemID = Items.itemID
    LEFT JOIN Categories ON Items.itemID = Categories.categoryID
WHERE Users.userID=:input_userID AND Lists.listID=:input_listID
ORDER BY Categories.categoryName DESC

-- ---------------------------------------------------------------------------------------------------------
-- DELETE Item from the Shopping List 7/17
-- ---------------------------------------------------------------------------------------------------------

DELETE FROM List_of_Items WHERE List_of_Items.listOfItems=:input_listOfItems;

-- ---------------------------------------------------------------------------------------------------------
-- DELETE the Shopping List 7/17
-- ---------------------------------------------------------------------------------------------------------

DELETE FROM Lists WHERE Lists.listID=:input_listID;
