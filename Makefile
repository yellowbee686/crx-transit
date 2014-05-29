default:
	echo "Removing old package..."
	rm -f package/transit.zip
	echo "Making new package..."
	mkdir -p package
	cd extension && zip -r ../package/transit.zip * 
