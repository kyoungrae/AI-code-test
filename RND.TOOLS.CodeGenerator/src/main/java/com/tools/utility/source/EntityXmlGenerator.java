package com.tools.utility.source;

import com.tools.utility.entity.handler.EntityHandler;
import com.tools.utility.env.ConfigManager;
import org.w3c.dom.Document;
import org.w3c.dom.Element;

import javax.xml.parsers.DocumentBuilder;
import javax.xml.parsers.DocumentBuilderFactory;
import javax.xml.parsers.ParserConfigurationException;
import javax.xml.transform.OutputKeys;
import javax.xml.transform.Transformer;
import javax.xml.transform.TransformerFactory;
import javax.xml.transform.dom.DOMSource;
import javax.xml.transform.stream.StreamResult;
import java.io.*;
import java.util.*;

/**
 * <pre>
 * EntityXmlGenerator
 * </pre>
 *
 * @since 2024. 5. 17
 * @version 1.0
 * @author 이경태
 *
 */
public class EntityXmlGenerator {
    public static final String _root = "entities";
    public static final String _entity = "entity";
    public static final String _field = "field";

    public static Map changeToLowerMapKey(Map tableObject){
        Map origin = tableObject;
        Map<String,Object> temp = new HashMap<>();

        Set<String> set = origin.keySet();
        Iterator<String> iterator = set.iterator();

        while(iterator.hasNext()){
            String key = iterator.next();
            System.out.println((Object) origin.get(key));
            Object value = "";
            if((Object) origin.get(key) != null){
                value = (Object) origin.get(key);
            }

            temp.put(key.toUpperCase(), value);
//            System.out.println("[TABLE INFO] : " + key.toUpperCase() + " : "+ value);
        }
        return temp;
    }
    public static void main(String args[]) throws Exception{
        EntityHandler handler = new EntityHandler();
        List<Map<String, Object>> list = handler.select();
        int cnt = list.size();
        System.out.println(cnt);
        if(0 < cnt){
            // 1. Create XML Document
            DocumentBuilderFactory docBuilderFactory = DocumentBuilderFactory.newInstance();
            DocumentBuilder docBuilder = null;
            Document dom = null;

            try{
                docBuilder = docBuilderFactory.newDocumentBuilder();
            }catch(ParserConfigurationException e){
                throw new Exception(e + "ParserConfigurationException");
            }catch(Exception ex){
                throw ex;
            }
            dom = docBuilder.newDocument();

            Element xmlRoot = dom.createElement(_root);

            String tableName = "";
            String oldTableName = "";
            String camelCaseTableName ="";
            Element xmlEntity = null;

            for(int i = 0; i < cnt; i++ ){
                Map<String, Object> tableObject = list.get(i);
                tableObject = changeToLowerMapKey(tableObject);
//                System.out.println(tableObject);

                tableName = nvl(tableObject.get("TABLE_NAME"), "").toString();
                camelCaseTableName = tableName.toLowerCase();
                String[] tempCamelCaseSetting = camelCaseTableName.split("_");

                camelCaseTableName = tempCamelCaseSetting.length > 0 ? tempCamelCaseSetting[0] : "";

                for(int h = 1; h < tempCamelCaseSetting.length; h++){
                    String part = tempCamelCaseSetting[h];
                    if (part != null && part.length() > 0) {
                        String rStr = part.substring(0,1).toUpperCase() + part.substring(1);
                        System.out.println(rStr);
                        tempCamelCaseSetting[h] = rStr;
                        camelCaseTableName += tempCamelCaseSetting[h];
                    }
                }

                if(!tableName.equals(oldTableName)){
                    xmlEntity = dom.createElement(_entity);
                    xmlEntity.setAttribute("build", "yes");
                    xmlEntity.setAttribute("name", camelCaseTableName);
                    xmlEntity.setAttribute("tablename", tableName);
                    xmlEntity.setAttribute("service", camelCaseTableName);
                    xmlEntity.setAttribute("desc", nvl(tableObject.get("TABLE_COMMENTS"),"").toString());
                    xmlEntity.setAttribute("namespace", ConfigManager.getProperty("giens.Framework.Automation.Gen.namespace"));
                    xmlEntity.setAttribute("scope", ConfigManager.getProperty("giens.Framework.Automation.Gen.scope"));
                    xmlRoot.appendChild(xmlEntity);
                }
//                System.out.println("TABLE_NAME : " + tableObject.get("TABLE_NAME"));
//                System.out.println("COLUMN_NAME : " + tableObject.get("COLUMN_NAME"));
//                System.out.println("COLUMN_KEY : " + tableObject.get("COLUMN_KEY"));
//                System.out.println("COLUMN_LENGTH : " + tableObject.get("COLUMN_LENGTH"));
//                System.out.println("COLUMN_TYPE : " + tableObject.get("COLUMN_TYPE"));
//                System.out.println("COLUMN_NULLABLE : " + tableObject.get("COLUMN_NULLABLE"));
//                System.out.println("COLUMN_DEFAULT : " + tableObject.get("COLUMN_DEFAULT"));
//                System.out.println("COLUMN_COMMENTS : " + tableObject.get("COLUMN_COMMENTS"));
//                System.out.println("================================================");

                Element xmlfield = dom.createElement(_field);
                xmlfield.setAttribute("name", nvl(tableObject.get("COLUMN_NAME"), "").toString());
                xmlfield.setAttribute("keyfield", nvl(tableObject.get("COLUMN_KEY"), "").toString());
                xmlfield.setAttribute("length", nvl(tableObject.get("COLUMN_LENGTH"), "").toString());
                xmlfield.setAttribute("type", nvl(tableObject.get("COLUMN_TYPE"), "").toString());
                xmlfield.setAttribute("nullable", nvl(tableObject.get("COLUMN_NULLABLE"), "").toString());
                xmlfield.setAttribute("default", nvl(tableObject.get("COLUMN_DEFAULT"),"").toString());
                xmlfield.setAttribute("desc", nvl(tableObject.get("COLUMN_COMMENTS"),"").toString());

                if (xmlEntity != null) {
                    xmlEntity.appendChild(xmlfield);
                }
                oldTableName = tableName;
//                System.out.println(tableObject);
            }
            dom.appendChild(xmlRoot);
            // XML serialization using Transformer
            TransformerFactory transformerFactory = TransformerFactory.newInstance();
            Transformer transformer = transformerFactory.newTransformer();
            transformer.setOutputProperty(OutputKeys.ENCODING, "UTF-8");
            transformer.setOutputProperty(OutputKeys.INDENT, "yes");
            transformer.setOutputProperty("{http://xml.apache.org/xslt}indent-amount", "4");

            DOMSource source = new DOMSource(dom);
            StringWriter writer = new StringWriter();
            StreamResult result = new StreamResult(writer);

            transformer.transform(source, result);

            String xmlString = writer.toString();
            System.out.println(xmlString);

            try{
                FileOutputStream fileOutputStream = new FileOutputStream(ConfigManager.getProperty("giens.Framework.Automation.Gen.Entity.Xml.File"));
                BufferedWriter bufferedWriter = new BufferedWriter(new OutputStreamWriter(fileOutputStream , ConfigManager.getProperty("giens.Framework.Automation.Gen.File.Encoding")));
                bufferedWriter.write(xmlString);
                bufferedWriter.close();
                System.out.println(tableName+" Xml Generate Success!!");
            } catch (IOException e){
                throw new Exception(e);
            }
        }
    }
    private static Object nvl(Object obj , Object destobj){
        if(null == obj) return destobj;
        return obj;
    }

}

